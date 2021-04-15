


import java.io.*;
import java.net.*;

URL url = new URL("endpoint-url");
HttpURLConnection conn = (HttpURLConnection) url.openConnection();
conn.setRequestMethod("GET");
conn.setRequestProperty("Authorization","Bearer <api-key>");
conn.setRequestProperty("Accept", "application/vnd.api+json");

conn.getInputStream()