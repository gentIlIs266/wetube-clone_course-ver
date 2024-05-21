import "dotenv/config"
import app from "./server";
import "./db";
import "./models/Video";
import "./models/User";

const PORT = 4000;
const handleListening = () => {
    console.log(`[O] Server listenling to http://localhost:${PORT}`);
};

app.listen(PORT, handleListening);
process.on('uncaughtException', (err) => {
    console.log(`[X] There was a problem listening port ${PORT}, err: ${err}`);
});
