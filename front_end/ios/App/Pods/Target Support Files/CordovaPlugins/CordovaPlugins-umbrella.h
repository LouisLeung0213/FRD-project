#ifdef __OBJC__
#import <UIKit/UIKit.h>
#else
#ifndef FOUNDATION_EXPORT
#if defined(__cplusplus)
#define FOUNDATION_EXPORT extern "C"
#else
#define FOUNDATION_EXPORT extern
#endif
#endif
#endif

#import "AppDelegate+FCMPlugin.h"
#import "FCMNotificationCenterDelegate.h"
#import "FCMPlugin.h"
#import "FCMPluginIOS9Support.h"
#import "AppDelegate+FirebasePlugin.h"
#import "Firebase.h"
#import "FirebasePlugin.h"

FOUNDATION_EXPORT double CordovaPluginsVersionNumber;
FOUNDATION_EXPORT const unsigned char CordovaPluginsVersionString[];

