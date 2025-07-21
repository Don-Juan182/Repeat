 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/Onboarding.js b/Onboarding.js
index 4b2ae74a224e62e5e4ad0b14beced5209902d32e..f870c601499124db6f04e023538cc7a55e561c96 100644
--- a/Onboarding.js
+++ b/Onboarding.js
@@ -1,27 +1,28 @@
 import React, { useState } from 'react';
-import { View, StyleSheet, Text, TextInput, Picker, Button } from 'react-native';
+import { View, StyleSheet, Text, TextInput, Button } from 'react-native';
+import { Picker } from '@react-native-picker/picker';
 
 const muscleGroups = ['Full Body', 'Legs', 'Arms', 'Core'];
 const equipmentOptions = ['None', 'Dumbbells', 'Kettlebells', 'Bands', 'Machines'];
 
 export default function Onboarding({ onComplete }) {
   const [minutes, setMinutes] = useState('10');
   const [muscle, setMuscle] = useState(muscleGroups[0]);
   const [equipment, setEquipment] = useState(equipmentOptions[0]);
 
   const finish = () => {
     onComplete({ minutes, muscle, equipment });
   };
 
   return (
     <View style={styles.container}>
       <Text style={styles.title}>Daily Goal (minutes)</Text>
       <TextInput
         style={styles.input}
         keyboardType="number-pad"
         value={minutes}
         onChangeText={setMinutes}
       />
 
       <Text style={styles.title}>Focus Muscle Group</Text>
       <Picker selectedValue={muscle} onValueChange={setMuscle} style={styles.picker}>
 
EOF
)
