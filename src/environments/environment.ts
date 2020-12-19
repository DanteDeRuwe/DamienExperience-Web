// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  mapbox: {
    accessToken: 'pk.eyJ1Ijoiam9yZHl2YW5rZXJrdm9vcmRlIiwiYSI6ImNrZzNvN3o2bTBicncycHBqYzRtZW50dHkifQ.ceuhpKlsJFUPaxinU4qoag'
  },
  apiUrl: '/api',
  url : 'http://localhost:4200' ,
  chatApi: 'http://localhost:3000/',
  liveChatApi: 'https://damienexperience-chat.herokuapp.com',
  trackingHubUrl: "https://localhost:5001/tracking",
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
