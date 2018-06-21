<template>
  <div class="c-agenda">
    <div v-for="event in events.slice(0, toShow)" class="c-agenda__event">
      <strong class="c-agenda__event-date">{{ event.startVerbose }}</strong>
      <a v-bind:href="event.link" class="c-emphasized-anchor" target="_blank">{{ event.title }}</a>
    </div>
    <a v-if="toShow < events.length" v-on:click="showMore()" class="c-emphasized-anchor c-agenda__more">Zobrazit další &raquo;</a>
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
        events: [],
        toShow: 7,
      };
    },
    methods: {
      showMore() {
        this.toShow += pageSize;
      },

      loadEventsFromStorage() {
        if (window.sessionStorage && window.sessionStorage['__pircal']) {
          return JSON.parse(window.sessionStorage['__pircal']);
        }
      },

      storeEventsToStorage() {
        if (window.sessionStorage) {
          window.sessionStorage['__pircal'] = JSON.stringify(this.events);
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

        this.$http.get(`https://www.googleapis.com/calendar/v3/calendars/${this.calendarId}/events?key=${encodeURIComponent(this.apiKey)}&maxResults=20&timeMin=${encodeURIComponent(timeMin)}&timeMax=${encodeURIComponent(timeMax)}&sanitizeHtml=true&singleEvents=true&maxAtendees=1`).then(resp => {
          const events = resp.body.items
            .map(e => {
              const start = new Date(e.start.dateTime);
              const end = new Date(e.end.dateTime);

              return {
                start: start,
                startVerbose: start.toLocaleDateString('cs-CZ', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'}),
                end: end,
                title: e.summary,
                description: e.description,
                link: e.htmlLink
              }
            })
            .sort((e1, e2) => e1.start < e2.start ? -1 : 1);

          this.events = events;
          this.storeEventsToStorage();
        });
      } else {
        this.events = ev;
      }
    }
  };
</script>

<style lang="scss">
  @import 'settings';

  .c-agenda__event-date {
    display: block;
  }

  .c-agenda__event {
    margin-bottom: 1rem;
  }

  .c-agenda__more {
    display: inline-block;
    margin-top: 1rem;
  }
</style>
