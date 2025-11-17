import React from 'react';
import './SkeletonLoader.css';

export const StatCardSkeleton = () => (
  <div className="skeleton-stat-card">
    <div className="skeleton skeleton-title"></div>
    <div className="skeleton skeleton-number"></div>
  </div>
);

export const EventRowSkeleton = () => (
  <div className="skeleton-event-row">
    <div className="skeleton-event-main">
      <div className="skeleton skeleton-text-lg"></div>
      <div className="skeleton skeleton-text-sm"></div>
    </div>
    <div className="skeleton skeleton-progress-bar"></div>
    <div className="skeleton skeleton-button"></div>
  </div>
);


export const TaskCardSkeleton = () => (
  <div className="skeleton-task-card">
    <div className="skeleton skeleton-text-lg"></div>
    <div className="skeleton skeleton-divider"></div>
    <div className="skeleton skeleton-text-sm"></div>
    <div className="skeleton skeleton-text-sm"></div>
    <div className="skeleton skeleton-text-sm"></div>
  </div>
);


export const RequestRowSkeleton = () => (
  <div className="skeleton-request-row">
    <div className="skeleton-request-main">
      <div className="skeleton skeleton-text-lg"></div>
      <div className="skeleton skeleton-text-sm"></div>
    </div>
    <div className="skeleton-request-actions">
      <div className="skeleton skeleton-button-sm"></div>
      <div className="skeleton skeleton-button-sm"></div>
    </div>
  </div>
);


export const EventHeaderSkeleton = () => (
  <div className="skeleton-event-header">
    <div>
      <div className="skeleton skeleton-title-lg"></div>
      <div className="skeleton skeleton-text-sm"></div>
    </div>
    <div className="skeleton skeleton-dot"></div>
  </div>
);


export const ProgressCardSkeleton = () => (
  <div className="skeleton-progress-card">
    <div className="skeleton skeleton-progress-bar-full"></div>
    <div className="skeleton-stats-row">
      <div className="skeleton skeleton-text-sm"></div>
      <div className="skeleton skeleton-text-sm"></div>
      <div className="skeleton skeleton-text-sm"></div>
    </div>
  </div>
);


export const PageSkeleton = ({ type = 'events' }) => {
  if (type === 'dashboard') {
    return (
      <div className="skeleton-container">
        <div className="skeleton skeleton-page-title"></div>
        <div className="skeleton-stats-grid">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
        <div className="skeleton-content-grid">
          <div className="skeleton-card">
            <div className="skeleton skeleton-card-title"></div>
            <EventRowSkeleton />
            <EventRowSkeleton />
            <EventRowSkeleton />
          </div>
          <div className="skeleton-card">
            <div className="skeleton skeleton-card-title"></div>
            <TaskCardSkeleton />
            <TaskCardSkeleton />
          </div>
        </div>
      </div>
    );
  }

  if (type === 'events') {
    return (
      <div className="skeleton-container">
        <div className="skeleton skeleton-page-title"></div>
        <div className="skeleton-card">
          <div className="skeleton skeleton-card-title"></div>
          <RequestRowSkeleton />
          <RequestRowSkeleton />
        </div>
        <div className="skeleton-card">
          <div className="skeleton skeleton-card-title"></div>
          <EventRowSkeleton />
          <EventRowSkeleton />
          <EventRowSkeleton />
          <EventRowSkeleton />
        </div>
      </div>
    );
  }

  if (type === 'eventtasks') {
    return (
      <div className="skeleton-container">
        <EventHeaderSkeleton />
        <ProgressCardSkeleton />
        <div className="skeleton-card">
          <div className="skeleton skeleton-card-title"></div>
          <div className="skeleton-tasks-grid">
            <TaskCardSkeleton />
            <TaskCardSkeleton />
            <TaskCardSkeleton />
          </div>
        </div>
      </div>
    );
  }

  if (type === 'tasks') {
    return (
      <div className="skeleton-container">
        <div className="skeleton skeleton-page-title"></div>
        <div className="skeleton-card">
          <div className="skeleton skeleton-card-title"></div>
          <div className="skeleton-tasks-grid">
            <TaskCardSkeleton />
            <TaskCardSkeleton />
            <TaskCardSkeleton />
            <TaskCardSkeleton />
          </div>
        </div>
      </div>
    );
  }

  if (type === 'employees') {
    return (
      <div className="skeleton-container">
        <div className="skeleton skeleton-page-title"></div>
        <div className="skeleton-stats-grid skeleton-stats-grid-4">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
        <div className="skeleton-search-bar"></div>
        <div className="skeleton-employees-grid">
          <div className="skeleton-employee-card">
            <div className="skeleton-employee-header">
              <div className="skeleton skeleton-avatar"></div>
              <div>
                <div className="skeleton skeleton-text-md"></div>
                <div className="skeleton skeleton-text-sm"></div>
              </div>
            </div>
            <div className="skeleton-employee-stats">
              <div className="skeleton skeleton-stat-box"></div>
              <div className="skeleton skeleton-stat-box"></div>
              <div className="skeleton skeleton-stat-box"></div>
            </div>
            <div className="skeleton skeleton-progress-bar-full"></div>
          </div>
          <div className="skeleton-employee-card">
            <div className="skeleton-employee-header">
              <div className="skeleton skeleton-avatar"></div>
              <div>
                <div className="skeleton skeleton-text-md"></div>
                <div className="skeleton skeleton-text-sm"></div>
              </div>
            </div>
            <div className="skeleton-employee-stats">
              <div className="skeleton skeleton-stat-box"></div>
              <div className="skeleton skeleton-stat-box"></div>
              <div className="skeleton skeleton-stat-box"></div>
            </div>
            <div className="skeleton skeleton-progress-bar-full"></div>
          </div>
          <div className="skeleton-employee-card">
            <div className="skeleton-employee-header">
              <div className="skeleton skeleton-avatar"></div>
              <div>
                <div className="skeleton skeleton-text-md"></div>
                <div className="skeleton skeleton-text-sm"></div>
              </div>
            </div>
            <div className="skeleton-employee-stats">
              <div className="skeleton skeleton-stat-box"></div>
              <div className="skeleton skeleton-stat-box"></div>
              <div className="skeleton skeleton-stat-box"></div>
            </div>
            <div className="skeleton skeleton-progress-bar-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default PageSkeleton;
