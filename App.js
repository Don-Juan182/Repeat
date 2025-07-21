 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/App.js b/App.js
index 61681067efe2eb8368cbea57fb56becb42b934e5..39e7d178530f907f8f933b48c85d665584a9f498 100644
--- a/App.js
+++ b/App.js
@@ -1,54 +1,130 @@
-import React, { useState } from 'react';
-import { SafeAreaView, StyleSheet, Text, Button } from 'react-native';
+import React, { useState, useEffect } from 'react';
+import { SafeAreaView, StyleSheet, Text, Button, Alert } from 'react-native';
 import Chain from './Chain';
 import Login from './Login';
 import Onboarding from './Onboarding';
+import { loadData, saveData, startOfWeek } from './storage';
 
 export default function App() {
-  const [user, setUser] = useState(null);
-  const [settings, setSettings] = useState(null);
-  const [streak, setStreak] = useState(0);
+  const [isReady, setIsReady] = useState(false);
+  const [data, setData] = useState({
+    user: null,
+    settings: null,
+    streak: 0,
+    lastWorkoutDate: null,
+    tokens: 1,
+    weekStart: startOfWeek(new Date()).toISOString(),
+    workouts: [],
+  });
+
+  const { user, settings, streak, lastWorkoutDate, tokens, weekStart } = data;
+
+  // load saved data
+  useEffect(() => {
+    (async () => {
+      const stored = await loadData();
+      if (stored) {
+        setData(stored);
+      }
+      setIsReady(true);
+    })();
+  }, []);
+
+  // persist any changes
+  useEffect(() => {
+    if (isReady) {
+      saveData(data);
+    }
+  }, [data, isReady]);
+
+  // weekly token reset and streak break check
+  useEffect(() => {
+    if (!isReady) return;
+    const today = new Date();
+    const todayStr = today.toISOString().slice(0, 10);
+
+    const thisWeekStart = startOfWeek(today).toISOString();
+    if (weekStart !== thisWeekStart) {
+      setData(prev => ({ ...prev, tokens: 1, weekStart: thisWeekStart }));
+    } else if (lastWorkoutDate && lastWorkoutDate !== todayStr) {
+      const last = new Date(lastWorkoutDate);
+      const diff = Math.floor((today - last) / (1000 * 60 * 60 * 24));
+      if (diff > 1) {
+        if (tokens > 0) {
+          Alert.alert('Forgiveness token used', 'Your streak is preserved for today.');
+          setData(prev => ({ ...prev, tokens: prev.tokens - 1, lastWorkoutDate: todayStr }));
+        } else {
+          setData(prev => ({ ...prev, streak: 0 }));
+        }
+      }
+    }
+  }, [isReady]);
+
+  // schedule daily reminder when settings are set
+  useEffect(() => {
+    if (!settings) return;
+    scheduleReminder(settings.minutes);
+  }, [settings]);
+
+  const scheduleReminder = async (minutes) => {
+    // Placeholder for local notification scheduling
+    console.log(`Reminder scheduled for ${minutes} minutes`);
+  };
+
+  const handleLogin = (u) => setData(prev => ({ ...prev, user: u }));
+
+  const finishOnboarding = (vals) => setData(prev => ({ ...prev, settings: vals }));
+
+  const completeWorkout = () => {
+    const todayStr = new Date().toISOString().slice(0, 10);
+    if (lastWorkoutDate === todayStr) return;
+    setData(prev => ({
+      ...prev,
+      streak: prev.streak + 1,
+      lastWorkoutDate: todayStr,
+      workouts: [...prev.workouts, { date: todayStr, minutes: prev.settings.minutes }],
+    }));
+  };
+
+  if (!isReady) {
+    return null;
+  }
 
   if (!user) {
-    return <Login onLogin={() => setUser({})} />;
+    return <Login onLogin={handleLogin} />;
   }
 
   if (!settings) {
-    return (
-      <Onboarding
-        onComplete={(vals) => {
-          setSettings(vals);
-        }}
-      />
-    );
+    return <Onboarding onComplete={finishOnboarding} />;
   }
 
   return (
     <SafeAreaView style={styles.container}>
       <Text style={styles.title}>Repeat</Text>
       <Chain count={streak} />
       <Text style={styles.subtitle}>Daily goal: {settings.minutes} min</Text>
-      <Button title="Complete Workout" onPress={() => setStreak(streak + 1)} />
+      <Button title="Complete Workout" onPress={completeWorkout} />
+      <Text style={styles.subtitle}>Tokens left: {tokens}</Text>
     </SafeAreaView>
   );
 }
 
 const accent = '#3B82F6';
 
 const styles = StyleSheet.create({
   container: {
     flex: 1,
     justifyContent: 'center',
     alignItems: 'center',
     backgroundColor: '#F4F4F4',
   },
   title: {
     fontSize: 32,
     marginBottom: 20,
     color: accent,
     fontWeight: '600',
   },
   subtitle: {
     marginVertical: 10,
   },
 });
 
EOF
)
