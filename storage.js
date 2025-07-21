 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a//dev/null b/storage.js
index 0000000000000000000000000000000000000000..bb98356167913017ea7c97c00946fa9223f25b2f 100644
--- a//dev/null
+++ b/storage.js
@@ -0,0 +1,29 @@
+import AsyncStorage from '@react-native-async-storage/async-storage';
+
+const KEY = 'repeat:data';
+
+export async function loadData() {
+  try {
+    const json = await AsyncStorage.getItem(KEY);
+    return json != null ? JSON.parse(json) : null;
+  } catch (e) {
+    console.error('Failed to load', e);
+    return null;
+  }
+}
+
+export async function saveData(data) {
+  try {
+    await AsyncStorage.setItem(KEY, JSON.stringify(data));
+  } catch (e) {
+    console.error('Failed to save', e);
+  }
+}
+
+export function startOfWeek(date = new Date()) {
+  const day = date.getDay(); // 0=Sun
+  const diff = date.getDate() - day + 1; // Monday as start
+  const monday = new Date(date.setDate(diff));
+  monday.setHours(0, 0, 0, 0);
+  return monday;
+}
 
EOF
)
