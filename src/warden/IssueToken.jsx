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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      setIsLoading(true);
      try {
        const wardenInfo = JSON.parse(localStorage.getItem("wardenInfo")); 
        const token = localStorage.getItem("wardenToken");
  
        if (!wardenInfo || !wardenInfo.id) {
          throw new Error("Warden information not found");
        }
  
        if (!token) {
          throw new Error("Authentication token not found");
        }
  
        const response = await fetch(`http://localhost:5000/api/student/under-warden?wardenId=${wardenInfo.id}`, {
          headers: {
             "Authorization": `Bearer ${token}`,
             "Content-Type": "application/json",
          },
       });
       
        const data = await response.json();
        console.log("API Response:", data);
       
        // ✅ Extract students correctly
        const students = data.students || [];  // Extract the students array
       
        console.log("Fetched Student List:", students);
       
        if (students.length > 0) {
          console.log("Students available:", students);
          // Save the fetched students to state
          setSupervisedStudents(students);
        } else {
          console.error("No students found!");
        }
  
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching students:", error);
        setError(error.message);
        setIsLoading(false);
  
        if (error.message.includes("login") || error.message.includes("token") || error.message.includes("session")) {
          setTimeout(() => {
            window.location.href = "/warden-login";
          }, 2000);
        }
      }
    };
  
    fetchStudents();
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTokenData({
      ...tokenData,
      [name]: value
    });
  
    // Update suggestions if typing roll number
    if (name === 'student_roll_number') {
      if (value.length > 0) {
        // Filter students based on query - matching roll number or name
        const filtered = supervisedStudents.filter(student => 
          (student?.roll || '').toLowerCase().includes(value.toLowerCase()) || 
          (student?.name || '').toLowerCase().includes(value.toLowerCase())
        );
        
        setSuggestedStudents(filtered);
        setShowSuggestions(true);
      } else {
        setSuggestedStudents([]);
        setShowSuggestions(false);
      }
    }
  
    // Clear token preview when form changes
    setTokenPreview(null);
  };
  const handleStudentSearch = (query) => {
    if (query.length > 0) {
      // Filter students based on query - matching roll number or name
      const filtered = supervisedStudents.filter(student => 
        (student?.roll || '').toLowerCase().includes(query.toLowerCase()) || 
        (student?.name || '').toLowerCase().includes(query.toLowerCase())
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
    const value = e.target.value;
    setSearchTerm(value);
    
    // Filter students for suggestions in bulk mode
    if (value.length > 0) {
      const filtered = supervisedStudents.filter(student => 
        (student?.roll || '').toLowerCase().includes(value.toLowerCase()) || 
        (student?.name || '').toLowerCase().includes(value.toLowerCase()) ||
        (student?.department || '').toLowerCase().includes(value.toLowerCase())
      );
      setSuggestedStudents(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestedStudents([]);
      setShowSuggestions(false);
    }
  };

  const filteredSupervisedStudents = supervisedStudents.filter(student => 
    (student?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (student?.roll || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (student?.department || '').toLowerCase().includes(searchTerm.toLowerCase())
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
    // Make sure we're selecting from the filtered list if there's a search term
    const studentsToSelect = searchTerm ? filteredSupervisedStudents : supervisedStudents;
    setTokenData({
      ...tokenData,
      selectedStudents: [...studentsToSelect]
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
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateToken = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    
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
        const student = supervisedStudents.find(s => s.roll === tokenData.student_roll_number);
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
    setSearchTerm('');
    setSuggestedStudents([]);
    setShowSuggestions(false);
  };

  if (isLoading) {
    return (
      <div className="issuetoken-container">
        <div className="issuetoken-loading">
          Loading student data...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="issuetoken-container">
        <div className="issuetoken-error">
          <h2>Authentication Error</h2>
          <p>{error}</p>
          {error.includes("login") ? (
            <p>Redirecting to login page...</p>
          ) : (
            <button 
              onClick={() => {
                setError(null);
                setIsLoading(true);
                window.location.reload();
              }}
              className="issuetoken-retry-btn"
            >
              Retry
            </button>
          )}
        </div>
      </div>
    );
  }

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
                    onChange={handleChange}autoComplete="off"
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
                  
                  {/* Search field for bulk mode */}
                  <div className="issuetoken-form-group">
                    <label htmlFor="search_students">Search Students</label>
                    <div className="issuetoken-input-wrapper">
                      <input
                        id="search_students"
                        type="text"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        placeholder="Search by name, roll number, or department"
                        className="issuetoken-field"
                      />
                      {searchTerm && (
                        <button 
                          type="button" 
                          className="issuetoken-clear-btn"
                          onClick={() => {
                            setSearchTerm('');
                            setSuggestedStudents([]);
                            setShowSuggestions(false);
                          }}
                        >
                          ×
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {/* Student suggestions list in bulk mode */}
                  {isBulkMode && searchTerm && (
                    <div className="issuetoken-student-list">
                      {filteredSupervisedStudents.length > 0 ? (
                        filteredSupervisedStudents.map(student => (
                          <div 
                            key={student.roll} 
                            className={`issuetoken-student-item ${
                              tokenData.selectedStudents.some(s => s.roll === student.roll) ? 'selected' : ''
                            }`}
                            onClick={() => selectStudent(student)}
                          >
                            <span className="issuetoken-student-name">{student.name}</span>
                            <span className="issuetoken-student-roll">{student.roll}</span>
                            {student.department && (
                              <span className="issuetoken-student-dept">{student.department}</span>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="issuetoken-no-results">No students found matching "{searchTerm}"</div>
                      )}
                    </div>
                  )}
                  
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
              {recentIssues.length > 0 ? (
                recentIssues.map((issue, index) => (
                  <div key={index} className="issuetoken-recent-item">
                    <span className="issuetoken-recent-token">{issue.token}</span>
                    <span className="issuetoken-recent-name">{issue.name}</span>
                    <span className="issuetoken-recent-roll">{issue.roll}</span>
                    <span className="issuetoken-recent-validity">{issue.validity}</span>
                    <span className={`issuetoken-recent-status ${issue.status}`}>
                      {issue.status}
                    </span>
                  </div>
                ))
              ) : (
                <div className="issuetoken-no-recent">No tokens issued yet</div>
              )}
            </div>
          </div>
        </div>
        
        {/* Student Selector Modal for Browse button */}
        {showStudentSelector && (
          <div className="issuetoken-modal-backdrop">
            <div className="issuetoken-modal">
              <div className="issuetoken-modal-header">
                <h3>Select Student</h3>
                <button onClick={toggleStudentSelector}>×</button>
              </div>
              <div className="issuetoken-modal-search">
                <input
                  type="text"
                  placeholder="Search students"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
              <div className="issuetoken-modal-content">
                {filteredSupervisedStudents.length > 0 ? (
                  filteredSupervisedStudents.map(student => (
                    <div 
                      key={student.roll} 
                      className="issuetoken-modal-item"
                      onClick={() => {
                        selectStudent(student);
                        toggleStudentSelector();
                      }}
                    >
                      <span className="issuetoken-modal-name">{student.name}</span>
                      <span className="issuetoken-modal-roll">{student.roll}</span>
                      {student.department && (
                        <span className="issuetoken-modal-dept">{student.department}</span>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="issuetoken-modal-empty">
                    {searchTerm ? `No students found matching "${searchTerm}"` : 'No students available'}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  export default IssueToken;