 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/Login.js b/Login.js
index 645a6ba27273525d40e15704f41e1c669610cb14..5f7b426e881473e946a1aa548f072b0c07bd68a0 100644
--- a/Login.js
+++ b/Login.js
@@ -1,37 +1,47 @@
-import React from 'react';
+import React, { useEffect } from 'react';
 import { View, StyleSheet, Button, Text } from 'react-native';
+import { GoogleSignin } from '@react-native-google-signin/google-signin';
 
 export default function Login({ onLogin }) {
+  useEffect(() => {
+    GoogleSignin.configure();
+  }, []);
+
   const loginWithGoogle = async () => {
-    // TODO: integrate Google OAuth flow
-    onLogin();
+    try {
+      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
+      const userInfo = await GoogleSignin.signIn();
+      onLogin(userInfo);
+    } catch (e) {
+      console.warn('Google sign-in failed', e);
+    }
   };
 
   const loginWithVipps = async () => {
-    // TODO: integrate Vipps login flow
-    onLogin();
+    // Vipps integration would go here
+    onLogin({ provider: 'vipps' });
   };
 
   return (
     <View style={styles.container}>
       <Text style={styles.title}>Welcome to Repeat</Text>
       <Button title="Sign in with Google" onPress={loginWithGoogle} />
       <View style={styles.spacer} />
       <Button title="Sign in with Vipps" onPress={loginWithVipps} />
     </View>
   );
 }
 
 const styles = StyleSheet.create({
   container: {
     flex: 1,
     justifyContent: 'center',
     alignItems: 'center',
     backgroundColor: '#F4F4F4',
   },
   title: {
     fontSize: 24,
     marginBottom: 20,
     fontWeight: '600',
   },
   spacer: {
 
EOF
)
