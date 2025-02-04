import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import PageContent from '../../components/PageContent';
import { INITIAL_EVENTS } from './event-utils';
import EventModal from './EventModal';

const Calendar = () => {

  const [editable, setEditable] = React.useState(false)

  const handleDateSelect = (selectInfo) => {
    console.log(selectInfo)
    setEditable(true)
  };

  const handleEventClick = (clickInfo) => {
    console.log(clickInfo)
    setEditable(true)
  };

  return (
    <div style={{width: '100%', maxHeight: '100%', height: 'calc(100vh - 105px)', overflow: 'auto'}}>
       <PageContent className="calendar-app">
        <FullCalendar plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]} headerToolbar={{ left: 'prev, next today', center: 'title', right: 'dayGridMonth, timeGridWeek, timeGridDay' }} initialView="dayGridMonth" weekends editable selectable selectMirror dayMaxEvents nextDayThreshold={'09:00:00'} initialEvents={INITIAL_EVENTS} eventContent={renderEventContent} eventClick={handleEventClick} />
        <EventModal open={editable} onClose={() => setEditable(false)} onAddEvent={() => setEditable(false)} />
      </PageContent>
    </div>
     );
};

function renderEventContent(eventContent) {
  const { timeText, event } = eventContent;
  return (
    <>
      {timeText && (
        <>
          <div className="fc-daygrid-event-dot"></div>
          <div className="fc-event-time">{eventContent.timeText}</div>
        </>
      )}
      <div className="fc-event-title">{event.title}</div>
    </>
  );
}

export default Calendar;
