<template>
  <div class="c-agenda">
    <div v-for="group in eventGroups.slice(0, toShow)" v-bind:key="group.date" class="c-agenda__eventgroup">
      <strong class="c-agenda__event-date">{{ group.date }}</strong>
      <div class="c-agenda__event" v-for="event in group.events" v-bind:key="event.id">
        <span class="c-agenda__event-time" v-if="! event.allDay">{{ event.startTimeVerbose }}</span>
        <span class="c-agenda__event-time" v-if="event.allDay">celý den</span>
        <span class="c-agenda__event-title">
          <a v-bind:href="event.link" class="c-agenda__event-title-link c-emphasized-anchor" target="_blank">{{ event.title }}</a>
        </span>
      </div>
    </div>
    <a v-if="toShow < eventGroups.length" v-on:click="showMore()" class="c-emphasized-anchor c-agenda__more">Zobrazit další &raquo;</a>
  </div>
</template>

<script>
  const pageSize = 10;

  export default {
    props: {
      calendarId: {
        type: String,
        required: true,
      },
      apiKey: {
        type: String,
        required: true,
      }
    },
    data() {
      return {
        eventGroups: [],
        toShow: 7,
      };
    },
    methods: {
      showMore() {
        this.toShow += pageSize;
      },

      loadEventsFromStorage() {
        if (window.sessionStorage && window.sessionStorage['__pircal_' + this.calendarId]) {
          return JSON.parse(window.sessionStorage['__pircal_' + this.calendarId]);
        }
      },

      // Store events to sessionStorage if possible to save requests.
      storeEventsToStorage() {
        if (window.sessionStorage) {
          window.sessionStorage['__pircal_' + this.calendarId] = JSON.stringify(this.eventGroups);
        }
      }
    },
    mounted() {
      const ev = this.loadEventsFromStorage();

      if (! ev) {
        const toIso = now => now.toISOString().split('.')[0]+"Z";
        const now = new Date();
        const timeMin = now.toISOString();
        const timeMax = new Date(+now + (1000 * 60 * 60 * 24 * 90)).toISOString(); // 90 days ahead
        const reqUrl = `https://www.googleapis.com/calendar/v3/calendars/${this.calendarId}/events?key=${encodeURIComponent(this.apiKey)}&maxResults=150&timeMin=${encodeURIComponent(timeMin)}&timeMax=${encodeURIComponent(timeMax)}&sanitizeHtml=true&singleEvents=true&maxAtendees=1`;

        let counter = 0;

        this.$http.get(reqUrl).then(resp => {
          const events = resp.body.items
            .map(e => {
              const start = new Date(e.start.dateTime || e.start.date);
              const end = new Date(e.end.dateTime || e.end.date);

              const startDateVerbose = start.toLocaleDateString('cs-CZ', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'});
              const startTimeVerbose = start.getHours() + ':' + start.getMinutes().toString().padStart(2, '0');

              const allDay = ! e.start.dateTime;

              return {
                id: counter++,
                start: start,
                startDateVerbose,
                startTimeVerbose,
                allDay,
                end: end,
                title: e.summary,
                description: e.description,
                link: e.htmlLink
              };
            })
            .sort((e1, e2) => e1.start < e2.start ? -1 : 1);

          const eventGroups = [];

          events.forEach(e => {
            const group = eventGroups.find(g => g.date === e.startDateVerbose);

            if (group) {
              group.events.push(e);
            } else {
              eventGroups.push({date: e.startDateVerbose, events: [e]});
            }
          });

          this.eventGroups = eventGroups;
          this.storeEventsToStorage();
        });
      } else {
        this.eventGroups = ev;
      }
    }
  };
</script>

<style lang="scss">
  @import 'settings';

  .c-agenda__event {
    display: flex;
  }

  .c-agenda__event-date {
    display: block;
  }

  .c-agenda__event-time {
    min-width: 60px;
  }

  .c-agenda__event-title {
    flex: 1;

    .c-agenda__event-title-link  {
      white-space: normal;
    }
  }

  .c-agenda__eventgroup {
    margin-bottom: 1rem;
  }

  .c-agenda__more {
    display: inline-block;
    margin-top: 1rem;
  }
</style>
