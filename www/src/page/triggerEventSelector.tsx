import React from 'react';

interface TriggerEventSelectorProps {
  events: string[];
  onSelectEvent: (event: string) => void;
}

const TriggerEventSelector: React.FC<TriggerEventSelectorProps> = ({ events, onSelectEvent }) => {
  return (
    <div className="trigger-event-selector">
      <h2>Select Trigger Event</h2>
      <ul>
        {events.map((event) => (
          <li key={event} onClick={() => onSelectEvent(event)}>
            {event}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TriggerEventSelector;
