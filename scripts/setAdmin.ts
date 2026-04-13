import { auth } from '../src/config/firebaseConfig';

const uid = "Lt9yCJSVoogSqnugPrS1Iny3n3K2"; 

async function setInitialAdmin() {
    try {
        await auth.setCustomUserClaims(uid, { role: "admin" });

        console.log("Admin role set successfully");
    } catch (error) {
        console.error("Error setting admin role:", error);
    }
}

setInitialAdmin();