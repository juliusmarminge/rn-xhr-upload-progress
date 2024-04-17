import { StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import { useEffect } from 'react';

const fileUrl = 'https://utfs.io/f/69cce922-7a32-428d-b36e-7ee0194e6d2d-9kuze.pdf'

export default function TabOneScreen() {

  useEffect(() => {
    (async () => {
      // Download blob
      const blob = await new Promise<Blob>((r) => {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", fileUrl);
        xhr.responseType = "blob";
        xhr.addEventListener("progress", ({ loaded, total }) => {
          console.log("DOWNLOAD progress", { loaded, total });
        });
        xhr.addEventListener("load", () => {
          const blob = xhr.response;
          const uri = URL.createObjectURL(blob);
          console.log("DOWNLOAD loaded");
          r(Object.assign(blob, { uri }));
        });
        xhr.send();
      });

      console.log(
        "Downloaded blob, trying to POST it. Blob is ",
        blob.size,
        "B",
      );

      // Upload blob
      const formData = new FormData();
      formData.append("file", blob);

      const xhr = new XMLHttpRequest();
      // xhr.responseType = "text";
      xhr.upload.addEventListener(
        "progress",
        ({ loaded, total }) => {
          console.log("UPLOAD progress", { loaded, total });
        },
        false,
      );
      xhr.upload.addEventListener("load", () => {
        console.log("UPLOAD loaded", xhr.response);
      });

      xhr.open("POST", `http://${Constants.expoConfig?.hostUri}/api/upload-file`, true);
      // xhr.setRequestHeader("Content-Length", String(blob.size));
      // xhr.setRequestHeader("Content-Type", "application/octet-stream");

      xhr.send(JSON.stringify({ file: "fooo barba dfaosjfiasodjfoisdjf" }));
    })();
  }, []);


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab One</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="app/(tabs)/index.tsx" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
