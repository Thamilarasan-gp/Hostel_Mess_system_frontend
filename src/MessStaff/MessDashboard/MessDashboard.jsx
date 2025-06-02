import React, { useState, useEffect } from "react";
import { 
  Calendar, 
  PlusCircle, 
  List, 
  Star, 
  Users, 
  LogOut,
  Menu,
  ChevronRight,
  PieChart,
  Bell,
  X,
  TrendingUp,
  Filter,
  Search
} from "lucide-react";
import styles from "./MessDashboard.module.css";
import AddTimetable from "../AddTimetable";
import FoodList from "../FoodList";
import AddFood from "../AddFood";
import Feedback from "../../warden/MessAnalytics/Feedback";

// Component Wrappers
const TimetableWrapper = () => (
  <div className={styles.componentWrapper}>
    <div className={styles.componentHeader}>
      <div>
        <h2 className={styles.componentTitle}>Timetable Management</h2>
        <p className={styles.componentSubtitle}>Create and manage meal schedules efficiently</p>
      </div>
      <button className={styles.primaryButton}>
        Add Schedule
      </button>
    </div>
    <AddTimetable />
  </div>
);

const FoodAddWrapper = () => (
  <div className={styles.componentWrapper}>
    <div className={styles.componentHeader}>
      <h2 className={styles.componentTitle}>Add Food Items</h2>
      <p className={styles.componentSubtitle}>Expand your menu with delicious new dishes</p>
    </div>
    <AddFood />
  </div>
);

const FoodListWrapper = () => (
  <div className={styles.componentWrapper}>
    <div className={styles.componentHeader}>
      <div>
        <h2 className={styles.componentTitle}>Food Inventory</h2>
        <p className={styles.componentSubtitle}>Manage your complete menu catalog</p>
      </div>
      <div className={styles.searchContainer}>
        <div className={styles.searchInput}>
          <Search className={styles.searchIcon} size={20} />
          <input type="text" placeholder="Search items..." />
        </div>
        <button className={styles.filterButton}>
          <Filter size={20} />
        </button>
      </div>
    </div>
    <div className={styles.componentcontainer}>
      <FoodList />
    </div>
  </div>
);

const FeedbackWrapper = () => (
  <div className={styles.componentWrapper}>
    <div className={styles.componentHeader}>
      <h2 className={styles.componentTitle}>Customer Feedback</h2>
      <p className={styles.componentSubtitle}>Monitor reviews and improve service quality</p>
    </div>
    <div className={styles.componentcontainer}>
      <Feedback />
    </div>
  </div>
);

const MessDashboard = () => {
  const messName = localStorage.getItem("messName") || "Mess Dashboard";
  const [activeTab, setActiveTab] = useState("timetable");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const debounce = (func, delay) => {
      let timeoutId;
      return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
      };
    };

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    };

    const debouncedCheckMobile = debounce(checkMobile, 200);
    checkMobile();
    window.addEventListener('resize', debouncedCheckMobile);
    return () => window.removeEventListener('resize', debouncedCheckMobile);
  }, []);

  const tabs = [
    { id: "timetable", icon: Calendar, label: "Timetable", color: "blue" },
    { id: "addFood", icon: PlusCircle, label: "Add Food", color: "green" },
    { id: "foodList", icon: List, label: "Food List", color: "purple" },
    { id: "reviews", icon: Star, label: "Reviews", color: "yellow" },
  ];

  const stats = [
    { title: "Daily Meals", value: "142", subtitle: "Served Today", icon: PieChart, color: "blue", trend: "+12%" },
    { title: "Avg. Rating", value: "4.6", subtitle: "Out of 5.0", icon: Star, color: "yellow", trend: "+0.3" },
    { title: "Active Staff", value: "8", subtitle: "On Duty", icon: Users, color: "green", trend: "+2" },
    { title: "Monthly Revenue", value: "₹45K", subtitle: "This Month", icon: TrendingUp, color: "purple", trend: "+18%" }
  ];

  const handleLogout = () => {
    console.log("Logging out...");
  };

  const renderComponent = () => {
    switch (activeTab) {
      case "timetable": return <TimetableWrapper />;
      case "addFood": return <FoodAddWrapper />;
      case "foodList": return <FoodListWrapper />;
      case "reviews": return <FeedbackWrapper />;
      default: return <TimetableWrapper />;
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      {isMobile && sidebarOpen && (
        <div 
          className={styles.backdrop}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : styles.sidebarClosed} ${isMobile && !sidebarOpen ? styles.sidebarHidden : ''}`}>
        <div className={styles.sidebarHeader}>
          {sidebarOpen ? (
            <div className={styles.sidebarTitleContainer}>
              <h2 className={styles.sidebarTitle}>{messName}</h2>
              <p className={styles.sidebarSubtitle}>Management System</p>
            </div>
          ) : (
            <div className={styles.sidebarLogo}>
              {messName.charAt(0)}
            </div>
          )}
        </div>

        <nav className={styles.sidebarNav}>
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <div className={`${styles.navIcon} ${isActive ? styles[`navIcon${tab.color}`] : ''}`}>
                  <IconComponent size={20} />
                </div>
                {sidebarOpen && (
                  <div className={styles.navContent}>
                    <span className={styles.navLabel}>{tab.label}</span>
                    {isActive && <ChevronRight size={16} className={styles.navIndicator} />}
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        <div className={styles.sidebarFooter}>
          <button 
            className={styles.logoutButton}
            onClick={handleLogout}
            aria-label="Log out"
          >
            <div className={styles.logoutIcon}>
              <LogOut size={20} />
            </div>
            {sidebarOpen && <span className={styles.logoutText}>Logout</span>}
          </button>
        </div>
      </div>

      <div className={`${styles.mainContent} ${sidebarOpen && !isMobile ? styles.mainShifted : isMobile ? styles.mainFull : styles.mainCollapsed}`}>
        <header className={styles.mainHeader}>
          <div className={styles.headerLeft}>
            <button 
              className={styles.menuButton}
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
            >
              {sidebarOpen && !isMobile ? <X size={20} /> : <Menu size={20} />}
            </button>
            
            <div className={styles.breadcrumb}>
              <h1 className={styles.pageTitle}>
                {tabs.find(t => t.id === activeTab)?.label || "Dashboard"}
              </h1>
              <div className={styles.breadcrumbLinks}>
                <span>Home</span>
                <ChevronRight size={14} />
                <span className={styles.currentPage}>{tabs.find(t => t.id === activeTab)?.label}</span>
              </div>
            </div>
          </div>

          <div className={styles.headerRight}>
            <div className={styles.notificationButton}>
              <button aria-label="View notifications">
                <Bell size={20} />
                <span className={styles.notificationBadge}>3</span>
              </button>
            </div>

            <div className={styles.profileContainer}>
              <div className={styles.profileInfo}>
                <p className={styles.profileName}>{messName}</p>
                <p className={styles.profileRole}>Manager</p>
              </div>
              <div className={styles.profileAvatar}>
                A
              </div>
            </div>
          </div>
        </header>

        <main className={styles.contentArea}>
          <div className={styles.statsGrid}>
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div
                  key={index}
                  className={`${styles.statCard} ${styles[`statCard${stat.color}`]}`}
                >
                  <div className={styles.statHeader}>
                    <div className={`${styles.statIcon} ${styles[`statIcon${stat.color}`]}`}>
                      <IconComponent size={24} />
                    </div>
                    <span className={styles.statTrend}>
                      {stat.trend}
                    </span>
                  </div>
                  <div className={styles.statContent}>
                    <p className={styles.statValue}>{stat.value}</p>
                    <p className={styles.statTitle}>{stat.title}</p>
                    <p className={styles.statSubtitle}>{stat.subtitle}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className={styles.mainCard}>
            <div className={styles.animatedContent}>
              {renderComponent()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MessDashboard;