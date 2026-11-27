import {
  useEffect,
  useRef,
} from 'react'

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'

import frLocale from '@fullcalendar/core/locales/fr'

import type {
  EventInput,
  EventClickArg,
} from '@fullcalendar/core'

import type {
  DateClickArg,
} from '@fullcalendar/interaction'
import type {
  Reservation,
} from '../../types/reservation'

import type { Room } from '../../types/room'

import {
  getReservationPhase,
  getRoomName,
} from '../../utils/reservations'

import type {
  ReservationPhase,
} from '../../utils/reservations'

import './calendar.css'

interface BookingCalendarProps {
  reservations: Reservation[]
  rooms: Room[]
  now: Date
  showCancelled: boolean

  onReservationClick: (
    reservation: Reservation,
  ) => void

  onDateClick: (date: Date) => void
}

const eventColors: Record<
  ReservationPhase,
  {
    background: string
    border: string
    text: string
  }
> = {
  upcoming: {
    background: '#e0e7ff',
    border: '#6366f1',
    text: '#3730a3',
  },

  ongoing: {
    background: '#dbeafe',
    border: '#2563eb',
    text: '#1e40af',
  },

  completed: {
    background: '#f1f5f9',
    border: '#94a3b8',
    text: '#475569',
  },

  cancelled: {
    background: '#fee2e2',
    border: '#ef4444',
    text: '#991b1b',
  },
}

export function BookingCalendar({
  reservations,
  rooms,
  now,
  showCancelled,
  onReservationClick,
  onDateClick,
}: BookingCalendarProps) {
  const calendarRef =
    useRef<FullCalendar>(null)

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      '(max-width: 767px)',
    )

    function updateView(
      isMobile: boolean,
    ) {
      calendarRef.current
        ?.getApi()
        .changeView(
          isMobile
            ? 'timeGridDay'
            : 'timeGridWeek',
        )
    }

    updateView(mediaQuery.matches)

    function handleResize(
      event: MediaQueryListEvent,
    ) {
      updateView(event.matches)
    }

    mediaQuery.addEventListener(
      'change',
      handleResize,
    )

    return () => {
      mediaQuery.removeEventListener(
        'change',
        handleResize,
      )
    }
  }, [])

  const events: EventInput[] =
    reservations
      .filter(
        (reservation) =>
          showCancelled ||
          reservation.status !== 'cancelled',
      )
      .map((reservation) => {
        const phase =
          getReservationPhase(
            reservation,
            now,
          )

        const colors = eventColors[phase]

        const roomName = getRoomName(
          reservation.room_id,
          rooms,
        )

        return {
          id: String(reservation.id),

          title: reservation.purpose
            ? `${roomName} · ${reservation.purpose}`
            : roomName,

          start: reservation.start_time,
          end: reservation.end_time,

          allDay: false,

          backgroundColor:
            colors.background,

          borderColor:
            colors.border,

          textColor: colors.text,

          classNames:
            phase === 'cancelled'
              ? ['reservation-cancelled']
              : [],

          extendedProps: {
            reservationId:
              reservation.id,
          },
        }
      })

  function handleEventClick(
    info: EventClickArg,
  ) {
    const reservation =
      reservations.find(
        (item) =>
          String(item.id) === info.event.id,
      )

    if (reservation) {
      onReservationClick(reservation)
    }
  }

  function handleDateClick(
    info: DateClickArg,
  ) {
    onDateClick(info.date)
  }

  return (
    <div className="roombooking-calendar">

      <FullCalendar
        ref={calendarRef}

        plugins={[
          dayGridPlugin,
          timeGridPlugin,
          interactionPlugin,
        ]}

        locale={frLocale}

        initialView="timeGridWeek"

        timeZone="local"

        firstDay={1}

        headerToolbar={{
          left: 'prev,next today',
          center: 'title',

          right:
            'dayGridMonth,timeGridWeek,timeGridDay',
        }}

        buttonText={{
          today: "Aujourd'hui",
          month: 'Mois',
          week: 'Semaine',
          day: 'Jour',
        }}

        events={events}

        eventClick={handleEventClick}
        dateClick={handleDateClick}

        editable={false}
        selectable={false}

        nowIndicator={true}

        allDaySlot={false}

        slotMinTime="00:00:00"
        slotMaxTime="24:00:00"

        scrollTime="08:00:00"

        slotDuration="00:30:00"

        slotLabelFormat={{
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }}

        eventTimeFormat={{
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }}

        eventDisplay="block"

        displayEventEnd={true}

        dayMaxEvents={3}

        height="auto"

        stickyHeaderDates={true}
      />

    </div>
  )
}