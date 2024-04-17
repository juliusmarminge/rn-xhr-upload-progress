import { StyleSheet } from "react-native";
import Constants from "expo-constants";
import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import { useEffect } from "react";

const fileUrl =
  "https://utfs.io/f/c7b8cc69-f146-4d67-a0ab-65ddd2fbe4f7-1xb9tq.jpg";

const createBigJson = () => {
  const json = [];
  for (let i = 0; i < 1000; i++) {
    json.push({ foo: i });
  }
  return json;
};

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
        "B"
      );

      // Upload blob
      await new Promise((r) => {
        const formData = new FormData();
        formData.append("file", blob);

        const xhr = new XMLHttpRequest();
        // xhr.responseType = "text";
        xhr.open("POST", `http://192.168.1.5:3000`, true);
        xhr.upload.addEventListener("progress", ({ loaded, total }) => {
          console.log("UPLOAD progress", { loaded, total });
        });
        xhr.upload.addEventListener("load", () => {
          console.log("UPLOAD loaded", xhr.response);
          r(undefined);
        });

        xhr.addEventListener("load", () => {
          console.log("Upload done");
          r(undefined);
        });

        // xhr.setRequestHeader("Content-Length", String(blob.size));
        // xhr.setRequestHeader("Content-Type", "application/octet-stream");

        xhr.send(JSON.stringify(createBigJson()));
      });

      // Cleanup
      // @ts-expect-error
      URL.revokeObjectURL(blob.uri);

      console.log("Upload done");
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab One</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <EditScreenInfo path="app/(tabs)/index.tsx" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
