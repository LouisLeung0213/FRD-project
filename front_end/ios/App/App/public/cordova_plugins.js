
  cordova.define('cordova/plugin_list', function(require, exports, module) {
    module.exports = [
      {
          "id": "cordova-plugin-fcm-with-dependecy-updated.FCMPlugin",
          "file": "plugins/cordova-plugin-fcm-with-dependecy-updated/www/FCMPlugin.js",
          "pluginId": "cordova-plugin-fcm-with-dependecy-updated",
        "clobbers": [
          "FCM"
        ]
        },
      {
          "id": "cordova-plugin-firebase.FirebasePlugin",
          "file": "plugins/cordova-plugin-firebase/www/firebase.js",
          "pluginId": "cordova-plugin-firebase",
        "clobbers": [
          "FirebasePlugin"
        ]
        }
    ];
    module.exports.metadata =
    // TOP OF METADATA
    {
      "cordova-plugin-fcm-with-dependecy-updated": "7.8.0",
      "cordova-plugin-firebase": "2.0.5"
    };
    // BOTTOM OF METADATA
    });
    