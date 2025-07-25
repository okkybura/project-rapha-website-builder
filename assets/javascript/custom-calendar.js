const { Calendar } = FullCalendar;
const isMobile = window.innerWidth < 800;

const urlParams = new URLSearchParams(window.location.search);
const viewParam = urlParams.get('view');

const renderedDates = new Set();
const renderedMonthHeaders = new Set();

document.addEventListener('DOMContentLoaded', function () {
    const calendarEl = document.getElementById('calendar');

    const classesName = {
        1: 'card-1',
        2: 'card-2',
        3: 'card-3',
        4: 'card-4',
    };
    const classesText = {
        1: 'Arte e Educação',
        2: 'Introdução ao Direito Cons',
        3: '',
        4: 'Matemática',
    };

    const statusText = {
        1: 'Não Confirmada',
        2: 'Professor Confirmado',
        3: 'Visível para alunos'
    };

    const statusClass = {
        1: 'unconfirm',
        2: 'confirm',
        3: 'visible'
    };

    let initialView;
    let allDaySlot;

    if (viewParam === 'month') {
        initialView = 'dayGridMonth';
    }

    else if (viewParam === 'week') {
        initialView = 'timeGridWeek';
    }

    else if (viewParam === 'class') {
        initialView = 'listYear';
    }

    else {
        initialView = 'dayGridMonth';
    }

    if (allDaySlot === 'week') {
        allDaySlot = true;
    }

    else {
        allDaySlot = false;
    }

    const calendar = new Calendar(calendarEl, {
        initialView: initialView,
        allDaySlot: allDaySlot,

        hiddenDays: [],
        headerToolbar: false,
        locale: 'pt',
        slotLabelFormat: {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        },

        dayHeaderContent: function (arg) {
            if (initialView === 'listYear' && isMobile) {

                const date = arg.date;

                const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

                if (renderedMonthHeaders.has(monthKey)) {
                    return { html: '' };
                }

                renderedMonthHeaders.add(monthKey);

                let month = date.toLocaleDateString('pt', { month: 'long' });
                month = month.charAt(0).toUpperCase() + month.slice(1);

                return {
                    html: `
                        <div style="text-align:center;">
                            <div class="month-text">${month}</div>
                        </div>
                    `
                };

                return { html: '' };
            }

            else {
                let weekday
                const dayNumber = arg.date.getDate();
                const eventsOnThisDay = calendar.getEvents().filter(event =>
                    event.start.toDateString() === arg.date.toDateString()
                );

                const spans = eventsOnThisDay.map(event => {
                    const className = classesName[event.extendedProps.classes] || '';
                    return `<span class="${className}"></span>`;
                }).join('');

                if (isMobile) {
                    weekday = arg.date.toLocaleDateString('pt', { weekday: 'short' });
                }

                else {
                    weekday = arg.date.toLocaleDateString('pt', { weekday: 'long' });
                }

                if (viewParam === 'week') {
                    if (isMobile) {
                        return {
                            html: `
                            <div style="text-align:center;">
                                <div class="day-text">${weekday}</div>
                                <div class="day-number">${dayNumber}</div>
                                <div class="day-sign">${spans}</div>
                            </div>`
                        };
                    }
                    else {
                        return {
                            html: `
                            <div style="text-align:center;">
                                <div class="day-text">${weekday}</div>
                                <div class="day-number">${dayNumber}</div>
                            </div>`
                        };
                    }
                }

                else {
                    return {
                        html: `
                        <div style="text-align:center;">
                            <div class="day-text">${weekday}</div>
                        </div>`
                    };
                }
            }
        },

        eventDidMount: function (info) {
            if (initialView === 'listYear') {
                let weekdayName;

                const eventStart = info.event.start;
                const dayNumber = eventStart.getDate();
                const monthName = eventStart.toLocaleDateString('pt', { month: 'long' });

                const isToday = (() => {
                    const today = new Date();
                    return (
                        eventStart.getDate() === today.getDate() &&
                        eventStart.getMonth() === today.getMonth() &&
                        eventStart.getFullYear() === today.getFullYear()
                    );
                })();

                const dateKey = eventStart.toISOString().split('T')[0];
                const alreadyRendered = renderedDates.has(dateKey);

                if (isMobile) {
                    weekdayName = eventStart.toLocaleDateString('pt', { weekday: 'short' });
                }

                else {
                    weekdayName = eventStart.toLocaleDateString('pt', { weekday: 'long' });
                }

                const capitalizedWeekday = weekdayName.charAt(0).toUpperCase() + weekdayName.slice(1);

                if (!alreadyRendered) {
                    renderedDates.add(dateKey);
                }

                const dateClass = `time-date${isToday ? ' active' : ''}`;

                let dateContent = '';

                if (!alreadyRendered) {
                    dateContent = `
                        <span>
                            <span class="number">
                                ${dayNumber}
                            </span>
                            <span class="caption">
                                <span>de ${monthName}</span>
                                <span> | </span>
                                <span>${capitalizedWeekday}</span>
                            </span>
                        </span>
                    `;
                }

                const dateHtml = `
                    <div class="${dateClass}">
                        ${dateContent}
                    </div>
                `;

                const timeText = info.event.allDay
                    ? 'Dia inteiro'
                    : formatTimeRange(info.event.start, info.event.end);

                const customHtml = `
                    <td class="fc-event-time">
                        <div class="event-time">
                            ${dateHtml}
                            <div class="time-hour">
                                <div class="hour">
                                    <span>${timeText}</span>
                                </div>
                            </div>
                        </div>
                    </td>
                `;

                const defaultTimeCell = info.el.querySelector('.fc-list-event-time');
                if (defaultTimeCell) defaultTimeCell.style.display = 'none';

                info.el.insertAdjacentHTML('afterbegin', customHtml);
            }
        },

        eventContent: function (arg) {
            const event = arg.event;
            const { status, attachment, lesson } = event.extendedProps;

            const formatTime = date =>
                new Date(date).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                });

            const startTime = formatTime(event.start);
            const endTime = formatTime(event.end);

            const attachmentIcon = `
                        <svg viewBox='0 0 448 512' xmlns='http://www.w3.org/2000/svg' width="16" height="16" fill="currentColor">
                        <path d='M364.2 83.8c-24.4-24.4-64-24.4-88.4 0l-184 184c-42.1 42.1-42.1 110.3 0 152.4s110.3 42.1 152.4 0l152-152c10.9-10.9 28.7-10.9 39.6 0s10.9 28.7 0 39.6l-152 152c-64 64-167.6 64-231.6 0s-64-167.6 0-231.6l184-184c46.3-46.3 121.3-46.3 167.6 0s46.3 121.3 0 167.6l-176 176c-28.6 28.6-75 28.6-103.6 0s-28.6-75 0-103.6l144-144c10.9-10.9 28.7-10.9 39.6 0s10.9 28.7 0 39.6l-144 144c-6.7 6.7-6.7 17.7 0 24.4s17.7 6.7 24.4 0l176-176c24.4-24.4 24.4-64 0-88.4z'/>
                        </svg>
                    `;

            const wrapper = document.createElement('div');

            if (initialView === 'listYear') {
                if (!isMobile) {
                    wrapper.classList.add('fc-event-card');
                    wrapper.classList.add('secondary');
                    wrapper.classList.add(classesName[event.extendedProps.classes] || '');

                    wrapper.innerHTML = `
                        <div class="card-wrapper primary">
                            <a href="javascript:void(0);" data-toggle="modal" data-target="#modalClassDetailPrimary"></a>
                            <div class="wrapper-inner">
                                <div class="list-text">
                                    <div class="title">
                                        <h3 class="text-title">
                                            ${classesText[event.extendedProps.classes] || ''}
                                        </h3>
                                    </div>
                                </div>
                                <div class="list-lesson">
                                    <div class="lesson">
                                        <span>${lesson || ''}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="wrapper-inner">
                                <div class="list-status">
                                    <div class="status">
                                        <span class="${statusClass[status] || ''}">
                                            ${statusText[status] || ''}
                                        </span>
                                    </div>
                                </div>
                                <div class="list-icon">
                                    <div class="icon">
                                        <span>
                                            ${attachment ? attachmentIcon : ''}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                }

                else {
                    wrapper.classList.add('fc-event-card');
                    wrapper.classList.add('primary');
                    wrapper.classList.add(classesName[event.extendedProps.classes] || '');

                    wrapper.innerHTML = `
                        <a href="javascript:void(0);" data-toggle="modal" data-target="#modalClassDetailPrimary"></a>
                        <div class="fc-event-lesson">${lesson || ''}</div>
                        <div class="fc-event-time">${startTime} - ${endTime}</div>
                        <div class="fc-event-title">${classesText[event.extendedProps.classes] || ''}</div>
                        <div class="fc-event-status ${statusClass[status] || ''}">${statusText[status] || ''}</div>
                        <div class="fc-event-attachment">${attachment ? attachmentIcon : ''}</div>
                    `;
                }

                return { domNodes: [wrapper] };
            }

            else {
                wrapper.classList.add('fc-event-card');
                wrapper.classList.add('primary');
                wrapper.classList.add(classesName[event.extendedProps.classes] || '');

                wrapper.innerHTML = `
                    <a href="javascript:void(0);" data-toggle="modal" data-target="#modalClassDetailPrimary"></a>
                    <div class="fc-event-lesson">${lesson || ''}</div>
                    <div class="fc-event-time">${startTime} - ${endTime}</div>
                    <div class="fc-event-title">${classesText[event.extendedProps.classes] || ''}</div>
                    <div class="fc-event-status ${statusClass[status] || ''}">${statusText[status] || ''}</div>
                    <div class="fc-event-attachment">${attachment ? attachmentIcon : ''}</div>
                `;

                return { domNodes: [wrapper] };
            }

        },

        viewDidMount: function (arg) {
            const calendarEl = document.getElementById('calendar');

            calendarEl.classList.remove('calendar-week');
            calendarEl.classList.remove('calendar-list');

            if (initialView === 'timeGridWeek') {
                calendarEl.classList.add('calendar-week');
            }

            if (initialView === 'listYear') {
                calendarEl.classList.add('calendar-list');
            }
        },

        // Data

        events: [
            {
                classes: 2,
                start: '2025-07-23T10:30:00',
                end: '2025-07-23T11:30:00',
                lesson: 'Aula 7 de 10',
                status: 3,
                attachment: true
            },
            {
                classes: 2,
                start: '2025-07-23T11:30:00',
                end: '2025-07-23T12:30:00',
                lesson: 'Aula 7 de 10',
                status: 3,
                attachment: true
            },
            {
                classes: 4,
                start: '2025-07-25T12:30:00',
                end: '2025-07-25T14:30:00',
                lesson: 'Aula 13 de 24',
                status: 1,
                attachment: true
            },
            {
                classes: 1,
                start: '2025-09-24T10:30:00',
                end: '2025-09-24T11:30:00',
                lesson: 'Aula 7 de 10',
                status: 2,
                attachment: false
            },
        ],
    });

    // Time - Caption

    const updateCaption = () => {
        const currentDate = calendar.getDate();
        const monthName = currentDate.toLocaleString('pt-PT', { month: 'long' });
        const year = currentDate.getFullYear();

        document.querySelectorAll('.txtTimeCaption span').forEach(el => {

            if (initialView === 'listYear') {
                el.textContent = `janeiro - dezembro ${year}`;
            }
            
            else {
                el.textContent = `${monthName} de ${year}`;
            }
        });
    };

    updateCaption();
    calendar.on('datesSet', updateCaption);

    // Time - Button

    const leftBtn = document.querySelectorAll('.btnTimePrev');
    const rightBtn = document.querySelectorAll('.btnTimeNext');

    leftBtn.forEach(btn => {
        btn.addEventListener('click', () => {
            renderedMonthHeaders.clear();
            renderedDates.clear();
            calendar.prev();
        });
    });

    rightBtn.forEach(btn => {
        btn.addEventListener('click', () => {
            renderedMonthHeaders.clear();
            renderedDates.clear();
            calendar.next();
        });
    });

    // Time - Hide

    const updateHiddenDays = () => {
        const hidden = [];
        document.querySelectorAll('.day-toggle').forEach(cb => {
            if (!cb.checked) {
                hidden.push(parseInt(cb.value));
            }
        });
        calendar.setOption('hiddenDays', hidden);
    };

    document.querySelectorAll('.day-toggle').forEach(cb => {
        cb.addEventListener('change', function () {
            const checkedBoxes = Array.from(document.querySelectorAll('.day-toggle')).filter(c => c.checked);
            if (checkedBoxes.length === 0) {
                this.checked = true;
                alert("You must keep at least one day selected.");
                return;
            }

            updateHiddenDays();
        });
    });

    // Function

    function capitalizeFirstLetter(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    function formatTimeRange(start, end) {
        const startTime = start.toLocaleTimeString('pt', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });

        const endTime = end
            ? end.toLocaleTimeString('pt', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            })
            : '';

        return endTime ? `${startTime} - ${endTime}` : startTime;
    };

    if (initialView === 'listYear') {
        document.querySelector('#liNavbarFormPrimary').remove();
        document.querySelector('#divSidebarFormPrimary').remove();
    }

    if (viewParam) {
        if (viewParam === 'month') {
            document.querySelector('#txtCalendarView').textContent = 'Mês';
        }

        else if (viewParam === 'week') {
            document.querySelector('#txtCalendarView').textContent = 'Semana';
        }

        else if (viewParam === 'class') {
            document.querySelector('#txtCalendarView').textContent = 'Aulas';
        }  

        else {
            document.querySelector('#txtCalendarView').textContent = 'Mês';
        }
    }

    else {
        document.querySelector('#txtCalendarView').textContent = 'Mês';
    }

    calendar.render();
});