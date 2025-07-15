
const { Calendar } = FullCalendar;
const isMobile = window.innerWidth < 768;

const urlParams = new URLSearchParams(window.location.search);
const viewParam = urlParams.get('view');

document.addEventListener('DOMContentLoaded', function () {
    const calendarEl = document.getElementById('calendar');

    const calendar = new Calendar(calendarEl, {
        initialView: viewParam === 'week' ? 'timeGridWeek' : 'dayGridMonth',
        allDaySlot: viewParam === 'week' ? false : true,

        hiddenDays: [],
        headerToolbar: false,
        locale: 'pt',
        slotLabelFormat: {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        },

        dayHeaderContent: function (arg) {
            const weekday = arg.date.toLocaleDateString('pt', { weekday: 'long' });
            const dayNumber = arg.date.getDate();

            if (viewParam === 'week') {
                return {
                    html: `
                    <div style="text-align:center;">
                        <div class="day-text">${weekday}</div>
                        <div class="day-number">${dayNumber}</div>
                    </div>`
                };
            } else {
                return {
                    html: `
                    <div style="text-align:center;">
                        <div class="day-text">${weekday}</div>
                    </div>`
                };
            }
        },

        // Data

        events: [
            {
                classes: 2,
                start: '2025-07-13T10:30:00',
                end: '2025-07-13T11:30:00',
                lesson: 'Aula 7 de 10',
                status: 3,
                attachment: true
            },
            {
                classes: 1,
                start: '2025-07-15T10:30:00',
                end: '2025-07-15T11:30:00',
                lesson: 'Aula 7 de 10',
                status: 2,
                attachment: false
            },
            {
                classes: 4,
                start: '2025-07-15T12:30:00',
                end: '2025-07-15T13:30:00',
                lesson: 'Aula 13 de 24',
                status: 1,
                attachment: true
            },
        ],

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

            const attachmentIcon = `
                <svg viewBox='0 0 448 512' xmlns='http://www.w3.org/2000/svg' width="16" height="16" fill="currentColor">
                <path d='M364.2 83.8c-24.4-24.4-64-24.4-88.4 0l-184 184c-42.1 42.1-42.1 110.3 0 152.4s110.3 42.1 152.4 0l152-152c10.9-10.9 28.7-10.9 39.6 0s10.9 28.7 0 39.6l-152 152c-64 64-167.6 64-231.6 0s-64-167.6 0-231.6l184-184c46.3-46.3 121.3-46.3 167.6 0s46.3 121.3 0 167.6l-176 176c-28.6 28.6-75 28.6-103.6 0s-28.6-75 0-103.6l144-144c10.9-10.9 28.7-10.9 39.6 0s10.9 28.7 0 39.6l-144 144c-6.7 6.7-6.7 17.7 0 24.4s17.7 6.7 24.4 0l176-176c24.4-24.4 24.4-64 0-88.4z'/>
                </svg>
            `;

            const wrapper = document.createElement('div');
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
        },

        viewDidMount: function (arg) {
            const calendarEl = document.getElementById('calendar');
            calendarEl.classList.remove('calendar-week');

            if (arg.view.type === 'timeGridWeek') {
                calendarEl.classList.add('calendar-week');
            }
        },
    });

    // Time - Caption

    const updateCaption = () => {
        const currentDate = calendar.getDate();
        const monthName = currentDate.toLocaleString('pt-PT', { month: 'long' });
        const year = currentDate.getFullYear();

        document.querySelector('#txtTimeCaption span').textContent = `${monthName} de ${year}`;
    };

    updateCaption();
    calendar.on('datesSet', updateCaption);

    // Time - Button

    const leftBtn = document.getElementById('btnTimePrev');
    const rightBtn = document.getElementById('btnTimeNext');

    leftBtn.addEventListener('click', () => {
        calendar.prev();
    });

    rightBtn.addEventListener('click', () => {
        calendar.next();
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

    calendar.render();
});