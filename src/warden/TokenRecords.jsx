import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from "../apiurl";
import { Calendar, Clock, ChevronDown, ChevronUp, Search, User, RefreshCw } from "lucide-react";
import './TokenRecords.css';

function TokenRecords() {
  const wardenInfo = JSON.parse(localStorage.getItem("wardenInfo"));
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedTokenIndex, setExpandedTokenIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [studentNames, setStudentNames] = useState({});
  const [filterOpen, setFilterOpen] = useState(false);
  const [dateFilter, setDateFilter] = useState({
    startDate: '',
    endDate: ''
  });

  // Filter tokens based on date range
  const filteredTokens = tokens.filter(token => {
    if (!dateFilter.startDate && !dateFilter.endDate) return true;
    
    const tokenDate = new Date(token.valid_from);
    const startDate = dateFilter.startDate ? new Date(dateFilter.startDate) : null;
    const endDate = dateFilter.endDate ? new Date(dateFilter.endDate) : null;
    
    if (startDate && tokenDate < startDate) return false;
    if (endDate && tokenDate > endDate) return false;
    
    return true;
  });

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/token/gettokens/warden/${wardenInfo.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('wardenToken')}`, // Add auth header
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        if (response.ok) {
          // Normalize data to always be an array
          const tokensArray = Array.isArray(data) ? data : data ? [data] : [];
          setTokens(tokensArray);
        } else {
          console.error("Error fetching tokens:", data.message);
          setTokens([]); // Set empty array on error
        }
      } catch (error) {
        console.error("Error:", error);
        setTokens([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    if (wardenInfo?.id) {
      fetchTokens();
    } else {
      console.error("Warden info not found");
      setLoading(false);
      setTokens([]);
    }
  }, [wardenInfo?.id]);

  const refreshTokens = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/token/gettokens/warden/${wardenInfo.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('wardenToken')}`, // Add auth header
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (response.ok) {
        // Normalize data to always be an array
        const tokensArray = Array.isArray(data) ? data : data ? [data] : [];
        setTokens(tokensArray);
      } else {
        console.error("Error refreshing tokens:", data.message);
        setTokens([]); // Set empty array on error
      }
    } catch (error) {
      console.error("Error:", error);
      setTokens([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const applyFilter = () => {
    setFilterOpen(false);
    // The filtering is already handled by the filteredTokens computation
  };

  const resetFilters = () => {
    setDateFilter({
      startDate: '',
      endDate: ''
    });
    setFilterOpen(false);
  };

  const toggleStudents = async (index, studentIds) => {
    if (expandedTokenIndex === index) {
      setExpandedTokenIndex(null);
      setSearchQuery("");
    } else {
      setExpandedTokenIndex(index);
      setSearchQuery("");

      // Fetch names only for uncached studentIds
      const newNames = {};
      for (let id of studentIds) {
        if (!studentNames[id]) {
          try {
            const res = await fetch(`${API_BASE_URL}/api/student/student-name/${id}`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('wardenToken')}`, // Add auth header
              },
            });
            const data = await res.json();
            newNames[id] = data.name || "Unknown";
          } catch (err) {
            newNames[id] = "Unknown";
            console.error("Error fetching student name:", err);
          }
        }
      }
      setStudentNames(prev => ({ ...prev, ...newNames }));
    }
  };

  return (
    <div className="tokens-container">
      <div className="tokens-wrapper">
        <div className="tokens-header">
          <h2 className="tokens-title">
            <Clock className="tokens-title-icon" />
            Recently Issued Tokens
          </h2>
          <div className="tokens-actions">
            <button 
              className="tokens-filter-btn" 
              onClick={() => setFilterOpen(!filterOpen)}
            >
              <Calendar className="tokens-action-icon" />
              Filter
            </button>
            <button 
              className="tokens-refresh-btn"
              onClick={refreshTokens}
            >
              <RefreshCw className="tokens-action-icon" />
              Refresh
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="tokens-loading">
            <div className="tokens-spinner"></div>
          </div>
        ) : filteredTokens.length > 0 ? (
          <>
            {filterOpen && (
              <div className="filter-panel">
                <h3 className="filter-title">Filter Tokens</h3>
                <div className="filter-form">
                  <div className="filter-field">
                    <label>Start Date</label>
                    <input 
                      type="date" 
                      value={dateFilter.startDate}
                      onChange={(e) => setDateFilter({...dateFilter, startDate: e.target.value})}
                      className="filter-input"
                    />
                  </div>
                  <div className="filter-field">
                    <label>End Date</label>
                    <input 
                      type="date"
                      value={dateFilter.endDate}
                      onChange={(e) => setDateFilter({...dateFilter, endDate: e.target.value})}
                      className="filter-input"
                    />
                  </div>
                  <div className="filter-actions">
                    <button className="filter-apply" onClick={applyFilter}>Apply Filter</button>
                    <button className="filter-reset" onClick={resetFilters}>Reset</button>
                  </div>
                </div>
              </div>
            )}
            <div className="tokens-list">
              {filteredTokens.slice(Math.max(filteredTokens.length - 5, 0)).reverse().map((token, index) => (
                <div key={index} className="token-card">
                  <div className="token-status-indicator"></div>
                  <div className="token-content">
                    <div className="token-dates">
                      <div className="token-date-item">
                        <Calendar className="token-date-icon token-date-from" />
                        <div>
                          <span className="token-date-label">Valid From</span>
                          <span className="token-date-value">{new Date(token.valid_from).toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="token-date-item">
                        <Calendar className="token-date-icon token-date-until" />
                        <div>
                          <span className="token-date-label">Valid Until</span>
                          <span className="token-date-value">{new Date(token.valid_until).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="token-info">
                      <span className="token-student-count">
                        {token.student_ids.length} {token.student_ids.length === 1 ? 'Student' : 'Students'}
                      </span>
                      <span className="token-status active">Active</span>
                    </div>
                    
                    <button 
                      onClick={() => toggleStudents(index, token.student_ids)}
                      className="token-toggle-button"
                    >
                      {expandedTokenIndex === index ? (
                        <>Hide Details <ChevronUp className="token-toggle-icon" /></>
                      ) : (
                        <>Show Details <ChevronDown className="token-toggle-icon" /></>
                      )}
                    </button>
                  </div>

                  {expandedTokenIndex === index && (
                    <div className="token-students">
                      <div className="token-search-container">
                        <Search className="token-search-icon" />
                        <input
                          type="text"
                          placeholder="Search student"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="token-search-input"
                        />
                      </div>
                      
                      {token.student_ids.filter(id =>
                        (studentNames[id] || id).toLowerCase().includes(searchQuery.toLowerCase())
                      ).length > 0 ? (
                        <ul className="student-list">
                          {token.student_ids
                            .filter(id =>
                              (studentNames[id] || id).toLowerCase().includes(searchQuery.toLowerCase())
                            )
                            .map((id, i) => (
                              <li key={i} className="student-item">
                                <User className="student-icon" />
                                <span>{studentNames[id] || id}</span>
                              </li>
                            ))}
                        </ul>
                      ) : (
                        <p className="no-results">No students match your search.</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="tokens-empty">
            <p>No tokens found.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default TokenRecords;