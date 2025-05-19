import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './IssueToken.module.css';
import { API_BASE_URL } from "../apiurl";

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
  
        const response = await fetch(`${API_BASE_URL}/api/student/under-warden?wardenId=${wardenInfo.id}`, {
          headers: {
             "Authorization": `Bearer ${token}`,
             "Content-Type": "application/json",
          },
        });
       
        const data = await response.json();
        
        // Extract students correctly
        const students = data.students || [];
        
        if (students.length > 0) {
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
        studentElement.classList.add(styles.fieldSuccess);
        setTimeout(() => {
          studentElement.classList.remove(styles.fieldSuccess);
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
    
    // Filter students for suggestions
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
  
    if (isNaN(startDate.getTime())) {
      newErrors.validity_start = 'Valid From date is invalid';
    }
  
    if (isNaN(endDate.getTime())) {
      newErrors.validity_end = 'Valid Until date is invalid';
    }
  
    if (startDate >= endDate) {
      newErrors.validity_end = 'Valid Until date must be after Valid From date';
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
      const wardenInfo = JSON.parse(localStorage.getItem("wardenInfo"));
      const token = localStorage.getItem("wardenToken");
  
      if (!wardenInfo || !wardenInfo.id) {
        throw new Error("Warden information not found");
      }
  
      if (!token) {
        throw new Error("Authentication token not found");
      }
  
      // Prepare data for API call
      let requestBody = {
        warden_id: wardenInfo.id,
        secret_text: `WARDEN-CUSTOM-QR-CODE-${Date.now().toString().slice(-5)}`,
      };
  
      // Handle both single and bulk mode
      if (isBulkMode) {
        requestBody.student_ids = tokenData.selectedStudents.map(student => student._id);
      } else {
        const selectedStudent = supervisedStudents.find(s => s.roll === tokenData.student_roll_number);
        if (!selectedStudent) {
          throw new Error("Selected student not found");
        }
        requestBody.student_ids = [selectedStudent._id];
      }
  
      // Convert dates to full ISO 8601 format
      const startDate = new Date(tokenData.validity_start);
      const endDate = new Date(tokenData.validity_end);
  
      // Ensure dates are valid
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        throw new Error("Invalid date format");
      }
  
      // Set dates to start and end of day in UTC
      requestBody.validity_start = new Date(
        Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate())
      ).toISOString();
      requestBody.validity_end = new Date(
        Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 23, 59, 59, 999)
      ).toISOString();
  
      // Make the API call
      const response = await fetch(`${API_BASE_URL}/api/token/generatetoken`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error: ${response.status} - ${errorText}`);
      }
  
      const data = await response.json();
  
      // Handle successful token generation
      if (data.success || data.message === "Token created successfully!") {
        if (isBulkMode) {
          const bulkTokens = data.tokens || [];
  
          if (bulkTokens.length > 0) {
            const firstToken = bulkTokens[0];
            const qrCodeData = firstToken.qrCode || data.qrCode;
  
            setTokenPreview({
              token: firstToken.token_code || "Generated Token",
              student: tokenData.selectedStudents.find(s => s._id === firstToken.student_id) || 
                      { name: firstToken.student_name, roll: firstToken.student_roll },
              validFrom: new Date(firstToken.validity_start || tokenData.validity_start).toLocaleDateString(),
              validTo: new Date(firstToken.validity_end || tokenData.validity_end).toLocaleDateString(),
              issueDate: new Date().toLocaleDateString(),
              issuedBy: wardenInfo.name || "Current Warden",
              bulkCount: bulkTokens.length,
              qrCode: qrCodeData,
            });
  
            const newRecentIssues = bulkTokens.map(tokenInfo => ({
              roll: tokenInfo.student_roll || '',
              name: tokenInfo.student_name || '',
              validity: `${new Date(tokenInfo.validity_start || tokenData.validity_start).toLocaleDateString()} - ${new Date(tokenInfo.validity_end || tokenData.validity_end).toLocaleDateString()}`,
              token: tokenInfo.token_code || '',
              status: 'active',
              qrCode: tokenInfo.qrCode || qrCodeData,
            }));
  
            setRecentIssues([...newRecentIssues, ...recentIssues].slice(0, 10));
          }
        } else {
          const tokenInfo = data.token || (data.tokens && data.tokens[0]) || {};
          const qrCodeData = tokenInfo.qrCode || data.qrCode;
  
          if (!qrCodeData) {
            console.error("QR code data not found in response");
            throw new Error("QR code not found in server response");
          }
  
          const student = supervisedStudents.find(s => s.roll === tokenData.student_roll_number);
  
          setTokenPreview({
            token: tokenInfo.token_code || data.token || "Generated Token",
            student: student || { 
              roll: tokenInfo.student_roll || tokenData.student_roll_number, 
              name: tokenInfo.student_name || "Unknown Student" 
            },
            validFrom: new Date(tokenInfo.validity_start || tokenData.validity_start).toLocaleDateString(),
            validTo: new Date(tokenInfo.validity_end || tokenData.validity_end).toLocaleDateString(),
            issueDate: new Date().toLocaleDateString(),
            issuedBy: wardenInfo.name || "Current Warden",
            qrCode: qrCodeData,
          });
  
          const newIssue = {
            roll: tokenInfo.student_roll || student?.roll || tokenData.student_roll_number,
            name: tokenInfo.student_name || student?.name || "Unknown",
            validity: `${new Date(tokenInfo.validity_start || tokenData.validity_start).toLocaleDateString()} - ${new Date(tokenInfo.validity_end || tokenData.validity_end).toLocaleDateString()}`,
            token: tokenInfo.token_code || data.token || "Generated Token",
            status: 'active',
            qrCode: qrCodeData,
          };
  
          setRecentIssues([newIssue, ...recentIssues.slice(0, 9)]);
        }
  
        alert("Token generated successfully!");
      } else {
        throw new Error(data.message || 'Failed to generate token');
      }
    } catch (error) {
      console.error('Error generating token:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Function to download QR code
  const downloadQRCode = (qrCode, tokenCode) => {
    if (!qrCode) {
      alert("QR code not available for download");
      return;
    }
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = qrCode;
    link.download = `token-${tokenCode || 'qrcode'}.png`;
    
    // Append to the document, click it, and remove it
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading student data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <div className={styles.errorIcon}>⚠️</div>
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
              className={styles.retryBtn}
            >
              Retry
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Issue Access Token</h1>
        <p className={styles.subtitle}>Generate time-limited access tokens for student entry/exit</p>
      </div>

      <div className={styles.modeSwitcher}>
        <button 
          className={`${styles.modeBtn} ${!isBulkMode ? styles.active : ''}`}
          onClick={() => setIsBulkMode(false)}
        >
          Single Student
        </button>
        <button 
          className={`${styles.modeBtn} ${isBulkMode ? styles.active : ''}`}
          onClick={() => setIsBulkMode(true)}
        >
          Multiple Students
        </button>
      </div>

      <div className={styles.content}>
        <div className={styles.formSection}>
          <form onSubmit={generateToken} className={styles.form}>
            {!isBulkMode ? (
              // Single student mode
              <div className={styles.formGroup}>
                <label htmlFor="student_roll_number">Student Roll Number</label>
                <div className={styles.inputWrapper}>
                  <input
                    id="student_roll_number"
                    type="text"
                    name="student_roll_number"
                    className={`${styles.field} ${errors.student_roll_number ? styles.fieldError : ''}`}
                    placeholder="Enter student roll number"
                    value={tokenData.student_roll_number}
                    onChange={handleChange}
                    autoComplete="off"
                  />
                  {tokenData.student_roll_number && (
                    <button 
                      type="button" 
                      className={styles.clearBtn}
                      onClick={() => setTokenData({...tokenData, student_roll_number: ''})}
                    >
                      ×
                    </button>
                  )}
                  <button 
                    type="button"
                    className={styles.browseBtn}
                    onClick={toggleStudentSelector}
                  >
                    Browse
                  </button>
                </div>
                {errors.student_roll_number && (
                  <p className={styles.errorText}>{errors.student_roll_number}</p>
                )}
                
                {showSuggestions && suggestedStudents.length > 0 && (
                  <div className={styles.suggestions}>
                    {suggestedStudents.map(student => (
                      <div 
                        key={student.roll} 
                        className={styles.suggestionItem}
                        onClick={() => selectStudent(student)}
                      >
                        <span className={styles.suggestionRoll}>{student.roll}</span>
                        <span className={styles.suggestionName}>{student.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              // Bulk mode
              <div className={styles.bulkSection}>
                <div className={styles.bulkHeader}>
                  <h3>Selected Students ({tokenData.selectedStudents.length})</h3>
                  <div className={styles.bulkActions}>
                    <button type="button" onClick={() => {
                      const studentsToSelect = searchTerm 
                        ? filteredSupervisedStudents 
                        : supervisedStudents;
                      setTokenData({
                        ...tokenData,
                        selectedStudents: [...studentsToSelect]
                      });
                    }}>Select All</button>
                    <button type="button" onClick={() => {
                      setTokenData({
                        ...tokenData,
                        selectedStudents: []
                      });
                    }}>Clear All</button>
                  </div>
                </div>
                
                {/* Search field for bulk mode */}
                <div className={styles.formGroup}>
                  <label htmlFor="search_students">Search Students</label>
                  <div className={styles.inputWrapper}>
                    <input
                      id="search_students"
                      type="text"
                      value={searchTerm}
                      onChange={handleSearchChange}
                      placeholder="Search by name, roll number, or department"
                      className={styles.field}
                    />
                    {searchTerm && (
                      <button 
                        type="button" 
                        className={styles.clearBtn}
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
                  <div className={styles.studentList}>
                    {filteredSupervisedStudents.length > 0 ? (
                      filteredSupervisedStudents.map(student => (
                        <div 
                          key={student.roll} 
                          className={`${styles.studentItem} ${
                            tokenData.selectedStudents.some(s => s.roll === student.roll) ? styles.selected : ''
                          }`}
                          onClick={() => selectStudent(student)}
                        >
                          <span className={styles.studentName}>{student.name}</span>
                          <span className={styles.studentRoll}>{student.roll}</span>
                          {student.department && (
                            <span className={styles.studentDept}>{student.department}</span>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className={styles.noResults}>No students found matching "{searchTerm}"</div>
                    )}
                  </div>
                )}
                
                <div className={styles.selectedStudents}>
                  {tokenData.selectedStudents.map(student => (
                    <div key={student.roll} className={styles.selectedStudent}>
                      <span>{student.name} ({student.roll})</span>
                      <button 
                        type="button" 
                        className={styles.removeBtn}
                        onClick={() => removeSelectedStudent(student.roll)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                {errors.selectedStudents && (
                  <p className={styles.errorText}>{errors.selectedStudents}</p>
                )}
              </div>
            )}

            <div className={styles.dateGroup}>
              <div className={styles.formGroup}>
                <label htmlFor="validity_start">Valid From</label>
                <input
                  type="date"
                  id="validity_start"
                  name="validity_start"
                  className={styles.dateField}
                  value={tokenData.validity_start}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
                {errors.validity_start && (
                  <p className={styles.errorText}>{errors.validity_start}</p>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="validity_end">Valid Until</label>
                <input
                  type="date"
                  id="validity_end"
                  name="validity_end"
                  className={styles.dateField}
                  value={tokenData.validity_end}
                  onChange={handleChange}
                  min={tokenData.validity_start}
                  required
                />
                {errors.validity_end && (
                  <p className={styles.errorText}>{errors.validity_end}</p>
                )}
              </div>
            </div>
            
            <div className={styles.actions}>
              <button 
                type="submit" 
                className={styles.generateBtn}
                disabled={isGenerating}
              >
                {isGenerating ? 'Generating...' : 'Generate Token'}
              </button>
              <button 
                type="button" 
                className={styles.resetBtn}
                onClick={resetForm}
              >
                Reset
              </button>
              <button 
                type="button" 
                className={styles.viewBtn}
                onClick={viewIssuedTokens}
              >
                View Issued Tokens
              </button>
            </div>
          </form>
        </div>

        {/* Token Preview Section */}
        {tokenPreview && (
          <div className={styles.preview}>
            <h3>Generated Token</h3>
            <div className={styles.previewContent}>
              <div className={styles.previewInfo}>
                <div className={styles.previewRow}>
                  <span className={styles.previewLabel}>Token:</span>
                  <span className={styles.previewValue}>{tokenPreview.token}</span>
                </div>
                <div className={styles.previewRow}>
                  <span className={styles.previewLabel}>Student:</span>
                  <span className={styles.previewValue}>
                    {tokenPreview.student.name} ({tokenPreview.student.roll})
                  </span>
                </div>
                <div className={styles.previewRow}>
                  <span className={styles.previewLabel}>Valid From:</span>
                  <span className={styles.previewValue}>{tokenPreview.validFrom}</span>
                </div>
                <div className={styles.previewRow}>
                  <span className={styles.previewLabel}>Valid Until:</span>
                  <span className={styles.previewValue}>{tokenPreview.validTo}</span>
                </div>
                <div className={styles.previewRow}>
                  <span className={styles.previewLabel}>Issue Date:</span>
                  <span className={styles.previewValue}>{tokenPreview.issueDate}</span>
                </div>
                <div className={styles.previewRow}>
                  <span className={styles.previewLabel}>Issued By:</span>
                  <span className={styles.previewValue}>{tokenPreview.issuedBy}</span>
                </div>
                {tokenPreview.bulkCount && (
                  <div className={styles.previewRow}>
                    <span className={styles.previewLabel}>Total Tokens:</span>
                    <span className={styles.previewValue}>{tokenPreview.bulkCount}</span>
                  </div>
                )}
              </div>
              
              {/* QR Code Display */}
              {tokenPreview.qrCode && (
                <div className={styles.qrContainer}>
                  <div className={styles.qrImage}>
                    <img src={tokenPreview.qrCode} alt="Token QR Code" />
                  </div>
                  <button 
                    className={styles.qrDownload}
                    onClick={() => downloadQRCode(tokenPreview.qrCode, tokenPreview.token)}
                  >
                    Download QR Code
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Student Selector Modal for Browse button */}
      {showStudentSelector && (
        <div className={styles.modalBackdrop} onClick={toggleStudentSelector}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Select Student</h3>
              <button className={styles.modalClose} onClick={toggleStudentSelector}>×</button>
            </div>
            <div className={styles.modalSearch}>
              <input
                type="text"
                placeholder="Search students by name, roll number, or department"
                value={searchTerm}
                onChange={handleSearchChange}
                className={styles.modalSearchInput}
              />
            </div>
            <div className={styles.modalContent}>
              {filteredSupervisedStudents.length > 0 ? (
                filteredSupervisedStudents.map(student => (
                  <div 
                    key={student.roll} 
                    className={styles.modalItem}
                    onClick={() => {
                      selectStudent(student);
                      toggleStudentSelector();
                    }}
                  >
                    <span className={styles.modalName}>{student.name}</span>
                    <span className={styles.modalRoll}>{student.roll}</span>
                    {student.department && (
                      <span className={styles.modalDept}>{student.department}</span>
                    )}
                  </div>
                ))
              ) : (
                <div className={styles.modalEmpty}>
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