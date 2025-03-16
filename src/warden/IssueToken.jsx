import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './IssueToken.css';

const IssueToken = () => {
  const navigate = useNavigate();
  const [tokenData, setTokenData] = useState({
    student_roll_number: '',
    validity_start: new Date().toISOString().split('T')[0],
    validity_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    selectedStudents: []
  });
  const [errors, setErrors] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestedStudents, setSuggestedStudents] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [tokenPreview, setTokenPreview] = useState(null);
  const [recentIssues, setRecentIssues] = useState([]);
  const [showStudentSelector, setShowStudentSelector] = useState(false);
  const [supervisedStudents, setSupervisedStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isBulkMode, setIsBulkMode] = useState(false);

  // Mock student data for demo
  const mockStudents = [
    { roll: 'S1001', name: 'Arun Kumar', course: 'B.Tech CSE', department: 'CSE' },
    { roll: 'S1022', name: 'Priya Sharma', course: 'B.Tech ECE', department: 'ECE' },
    { roll: 'S1045', name: 'Rahul Singh', course: 'B.Tech ME', department: 'ME' },
    { roll: 'S1078', name: 'Meera Reddy', course: 'B.Tech IT', department: 'IT' },
    { roll: 'S1079', name: 'Kiran Kumar', course: 'B.Tech CSE', department: 'CSE' },
    { roll: 'S1080', name: 'Ananya Patel', course: 'B.Tech ECE', department: 'ECE' },
    { roll: 'S1081', name: 'Vikram Choudhury', course: 'B.Tech ME', department: 'ME' },
    { roll: 'S1082', name: 'Deepa Srinivasan', course: 'B.Tech IT', department: 'IT' },
    { roll: 'S1083', name: 'Harish Mehta', course: 'B.Tech CSE', department: 'CSE' },
    { roll: 'S1084', name: 'Sakshi Verma', course: 'B.Tech ECE', department: 'ECE' }
  ];

  // Generate random tokens for recent issues
  useEffect(() => {
    const sampleIssues = [
      { roll: 'S1001', name: 'Arun Kumar', validity: '15 Mar - 14 Apr 2025', token: 'AK0315-7825', status: 'active' },
      { roll: 'S1078', name: 'Meera Reddy', validity: '12 Mar - 11 Apr 2025', token: 'MR0312-4521', status: 'active' },
      { roll: 'S1045', name: 'Rahul Singh', validity: '10 Mar - 9 Apr 2025', token: 'RS0310-9367', status: 'active' }
    ];
    setRecentIssues(sampleIssues);
    
    // Set supervised students (in a real app, this would come from an API)
    setSupervisedStudents(mockStudents);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTokenData({
      ...tokenData,
      [name]: value
    });

    // Update suggestions if typing roll number
    if (name === 'student_roll_number') {
      handleStudentSearch(value);
    }

    // Clear token preview when form changes
    setTokenPreview(null);
  };

  const handleStudentSearch = (query) => {
    if (query.length > 0) {
      const filtered = mockStudents.filter(student => 
        student.roll.toLowerCase().includes(query.toLowerCase()) || 
        student.name.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestedStudents(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestedStudents([]);
      setShowSuggestions(false);
    }
  };

  const selectStudent = (student) => {
    if (isBulkMode) {
      // In bulk mode, we add to the selectedStudents array
      if (!tokenData.selectedStudents.some(s => s.roll === student.roll)) {
        setTokenData({
          ...tokenData,
          selectedStudents: [...tokenData.selectedStudents, student]
        });
      }
    } else {
      // In single mode, we set the student_roll_number
      setTokenData({
        ...tokenData,
        student_roll_number: student.roll
      });
      setShowSuggestions(false);
      
      // Show a quick preview of the student info
      const studentElement = document.getElementById('student_roll_number');
      if (studentElement) {
        studentElement.classList.add('issuetoken-field--success');
        setTimeout(() => {
          studentElement.classList.remove('issuetoken-field--success');
        }, 1000);
      }
    }
  };

  const removeSelectedStudent = (roll) => {
    setTokenData({
      ...tokenData,
      selectedStudents: tokenData.selectedStudents.filter(student => student.roll !== roll)
    });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredSupervisedStudents = supervisedStudents.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.roll.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleStudentSelector = () => {
    setShowStudentSelector(!showStudentSelector);
  };

  const toggleBulkMode = () => {
    setIsBulkMode(!isBulkMode);
    if (!isBulkMode) {
      // Switching to bulk mode
      setTokenData({
        ...tokenData,
        student_roll_number: '',
        selectedStudents: []
      });
    } else {
      // Switching back to single mode
      setTokenData({
        ...tokenData,
        selectedStudents: []
      });
    }
  };

  const selectAllStudents = () => {
    setTokenData({
      ...tokenData,
      selectedStudents: [...filteredSupervisedStudents]
    });
  };

  const clearAllStudents = () => {
    setTokenData({
      ...tokenData,
      selectedStudents: []
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!isBulkMode && !tokenData.student_roll_number.trim()) {
      newErrors.student_roll_number = 'Student roll number is required';
    }
    
    if (isBulkMode && tokenData.selectedStudents.length === 0) {
      newErrors.selectedStudents = 'Please select at least one student';
    }
    
    const startDate = new Date(tokenData.validity_start);
    const endDate = new Date(tokenData.validity_end);
    
    if (endDate <= startDate) {
      newErrors.validity_end = 'End date must be after start date';
    }
    
    return newErrors;
  };

  const generateToken = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length === 0) {
      setIsGenerating(true);
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        if (isBulkMode) {
          // Handle bulk token generation
          const bulkTokens = tokenData.selectedStudents.map(student => {
            const tokenStart = new Date(tokenData.validity_start);
            const tokenEnd = new Date(tokenData.validity_end);
            
            const initials = student.name.split(' ').map(name => name[0]).join('');
            const startDay = tokenStart.getDate().toString().padStart(2, '0');
            const startMonth = (tokenStart.getMonth() + 1).toString().padStart(2, '0');
            const randomNum = Math.floor(1000 + Math.random() * 9000);
            
            return {
              roll: student.roll,
              name: student.name,
              validity: `${tokenStart.getDate()} ${tokenStart.toLocaleString('default', { month: 'short' })} - ${tokenEnd.getDate()} ${tokenEnd.toLocaleString('default', { month: 'short' })} ${tokenEnd.getFullYear()}`,
              token: `${initials}${startMonth}${startDay}-${randomNum}`,
              status: 'active'
            };
          });
          
          // Update recent issues with bulk tokens
          setRecentIssues([...bulkTokens, ...recentIssues].slice(0, 10));
          
          // Show only the first token as preview
          if (bulkTokens.length > 0) {
            const firstStudent = tokenData.selectedStudents[0];
            const tokenStart = new Date(tokenData.validity_start);
            const tokenEnd = new Date(tokenData.validity_end);
            
            setTokenPreview({
              token: bulkTokens[0].token,
              student: firstStudent,
              validFrom: tokenStart.toLocaleDateString(),
              validTo: tokenEnd.toLocaleDateString(),
              issueDate: new Date().toLocaleDateString(),
              issuedBy: "Current Warden",
              bulkCount: bulkTokens.length
            });
          }
        } else {
          // Create single token preview
          const student = mockStudents.find(s => s.roll === tokenData.student_roll_number);
          const tokenStart = new Date(tokenData.validity_start);
          const tokenEnd = new Date(tokenData.validity_end);
          
          const initials = student ? student.name.split(' ').map(name => name[0]).join('') : 'XX';
          const startDay = tokenStart.getDate().toString().padStart(2, '0');
          const startMonth = (tokenStart.getMonth() + 1).toString().padStart(2, '0');
          const randomNum = Math.floor(1000 + Math.random() * 9000);
          
          const generatedToken = {
            token: `${initials}${startMonth}${startDay}-${randomNum}`,
            student: student || { roll: tokenData.student_roll_number, name: "Unknown Student", course: "Unknown" },
            validFrom: tokenStart.toLocaleDateString(),
            validTo: tokenEnd.toLocaleDateString(),
            issueDate: new Date().toLocaleDateString(),
            issuedBy: "Current Warden"
          };
          
          setTokenPreview(generatedToken);
          
          // Add to recent issues for demo purposes
          const newIssue = {
            roll: tokenData.student_roll_number,
            name: student ? student.name : "Unknown",
            validity: `${tokenStart.getDate()} ${tokenStart.toLocaleString('default', { month: 'short' })} - ${tokenEnd.getDate()} ${tokenEnd.toLocaleString('default', { month: 'short' })} ${tokenEnd.getFullYear()}`,
            token: generatedToken.token,
            status: 'active'
          };
          
          setRecentIssues([newIssue, ...recentIssues.slice(0, 9)]);
        }
        
        setIsGenerating(false);
      } catch (error) {
        console.error('Error generating token:', error);
        setIsGenerating(false);
      }
    } else {
      setErrors(newErrors);
    }
  };

  const viewIssuedTokens = () => {
    navigate('/issued-tokens');
  };

  const resetForm = () => {
    setTokenData({
      student_roll_number: '',
      validity_start: new Date().toISOString().split('T')[0],
      validity_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      selectedStudents: []
    });
    setTokenPreview(null);
    setErrors({});
    setIsBulkMode(false);
  };

  return (
    <div className="issuetoken-container">
      <div className="issuetoken-header">
        <h1>Issue Access Token</h1>
        <p className="issuetoken-subtitle">Generate time-limited access tokens for student entry/exit</p>
      </div>

      <div className="issuetoken-mode-switcher">
        <button 
          className={`issuetoken-mode-btn ${!isBulkMode ? 'active' : ''}`}
          onClick={() => setIsBulkMode(false)}
        >
          Single Student
        </button>
        <button 
          className={`issuetoken-mode-btn ${isBulkMode ? 'active' : ''}`}
          onClick={() => setIsBulkMode(true)}
        >
          Multiple Students
        </button>
      </div>

      <div className="issuetoken-content">
        <div className="issuetoken-form-section">
          <form onSubmit={generateToken} className="issuetoken-form">
            {!isBulkMode ? (
              // Single student mode
              <div className="issuetoken-form-group">
                <label htmlFor="student_roll_number">Student Roll Number</label>
                <div className="issuetoken-input-wrapper">
                  <input
                    id="student_roll_number"
                    type="text"
                    name="student_roll_number"
                    className={`issuetoken-field ${errors.student_roll_number ? 'issuetoken-field--error' : ''}`}
                    placeholder="Enter student roll number"
                    value={tokenData.student_roll_number}
                    onChange={handleChange}
                    autoComplete="off"
                  />
                  {tokenData.student_roll_number && (
                    <button 
                      type="button" 
                      className="issuetoken-clear-btn"
                      onClick={() => setTokenData({...tokenData, student_roll_number: ''})}
                    >
                      ×
                    </button>
                  )}
                  <button 
                    type="button"
                    className="issuetoken-browse-btn"
                    onClick={toggleStudentSelector}
                  >
                    Browse
                  </button>
                </div>
                {errors.student_roll_number && (
                  <p className="issuetoken-error">{errors.student_roll_number}</p>
                )}
                
                {showSuggestions && suggestedStudents.length > 0 && (
                  <div className="issuetoken-suggestions">
                    {suggestedStudents.map(student => (
                      <div 
                        key={student.roll} 
                        className="issuetoken-suggestion-item"
                        onClick={() => selectStudent(student)}
                      >
                        <span className="issuetoken-suggestion-roll">{student.roll}</span>
                        <span className="issuetoken-suggestion-name">{student.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              // Bulk mode
              <div className="issuetoken-bulk-section">
                <div className="issuetoken-bulk-header">
                  <h3>Selected Students ({tokenData.selectedStudents.length})</h3>
                  <div className="issuetoken-bulk-actions">
                    <button type="button" onClick={selectAllStudents}>Select All</button>
                    <button type="button" onClick={clearAllStudents}>Clear All</button>
                  </div>
                </div>
                <div className="issuetoken-selected-students">
                  {tokenData.selectedStudents.map(student => (
                    <div key={student.roll} className="issuetoken-selected-student">
                      <span>{student.name} ({student.roll})</span>
                      <button type="button" onClick={() => removeSelectedStudent(student.roll)}>×</button>
                    </div>
                  ))}
                </div>
                {errors.selectedStudents && (
                  <p className="issuetoken-error">{errors.selectedStudents}</p>
                )}
              </div>
            )}

            <div className="issuetoken-date-group">
              <div className="issuetoken-form-group">
                <label htmlFor="validity_start">Valid From</label>
                <input
                  type="date"
                  id="validity_start"
                  name="validity_start"
                  value={tokenData.validity_start}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="issuetoken-form-group">
                <label htmlFor="validity_end">Valid Until</label>
                <input
                  type="date"
                  id="validity_end"
                  name="validity_end"
                  value={tokenData.validity_end}
                  onChange={handleChange}
                  min={tokenData.validity_start}
                />
                {errors.validity_end && (
                  <p className="issuetoken-error">{errors.validity_end}</p>
                )}
              </div>
            </div>

            <div className="issuetoken-actions">
              <button 
                type="submit" 
                className="issuetoken-generate-btn"
                disabled={isGenerating}
              >
                {isGenerating ? 'Generating...' : 'Generate Token'}
              </button>
              <button 
                type="button" 
                className="issuetoken-reset-btn"
                onClick={resetForm}
              >
                Reset
              </button>
            </div>
          </form>
        </div>

        {/* Token Preview Section */}
        {tokenPreview && (
          <div className="issuetoken-preview">
            <h3>Token Preview</h3>
            <div className="issuetoken-preview-content">
              <p><strong>Token:</strong> {tokenPreview.token}</p>
              <p><strong>Student:</strong> {tokenPreview.student.name} ({tokenPreview.student.roll})</p>
              <p><strong>Valid From:</strong> {tokenPreview.validFrom}</p>
              <p><strong>Valid Until:</strong> {tokenPreview.validTo}</p>
              <p><strong>Issue Date:</strong> {tokenPreview.issueDate}</p>
              <p><strong>Issued By:</strong> {tokenPreview.issuedBy}</p>
              {tokenPreview.bulkCount && (
                <p><strong>Total Tokens Generated:</strong> {tokenPreview.bulkCount}</p>
              )}
            </div>
          </div>
        )}

        {/* Recent Issues Section */}
        <div className="issuetoken-recent">
          <div className="issuetoken-recent-header">
            <h3>Recently Issued Tokens</h3>
            <button onClick={viewIssuedTokens}>View All</button>
          </div>
          <div className="issuetoken-recent-list">
            {recentIssues.map((issue, index) => (
              <div key={index} className="issuetoken-recent-item">
                <span className="issuetoken-recent-token">{issue.token}</span>
                <span className="issuetoken-recent-name">{issue.name}</span>
                <span className="issuetoken-recent-roll">{issue.roll}</span>
                <span className="issuetoken-recent-validity">{issue.validity}</span>
                <span className={`issuetoken-recent-status ${issue.status}`}>
                  {issue.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueToken;