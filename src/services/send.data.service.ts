import { Server, Socket } from "socket.io";
import connection from "../configs/db.config";

export class WebSocketService {
  private packetBuffer: any[] = [];
  private isProcessing = false;

  constructor(private io: Server) {
    this.io.on("connection", this.handleConnection);
  }

  private handleConnection = (socket: Socket) => {
    console.log("WebSocket client connected");
    socket.on("userId", (userId: string) => {
      console.log(`Received userId: ${userId}`);
      if (userId) {
        socket.join(userId);
        console.log(`User ${socket.id} joined room ${userId}`);
      }
    });
    socket.on("newAccess", (movement) => {
      this.enqueuePacket({ event: "newAccess", movement });
      this.processNextPacket();
    });
  };

  private enqueuePacket(packet: any) {
    this.packetBuffer.push(packet);
  }

  private processNextPacket() {
    if (this.packetBuffer.length > 0 && !this.isProcessing) {
      this.isProcessing = true;
      const packet = this.packetBuffer.shift();
      this.handlePacket(packet);
    }
  }

  private async handlePacket(packet: any) {
    console.log("Processing packet:", packet);
    const { event, movement } = packet;
    console.log(`Processing ${event} with movement:`, movement);
    console.log("AA")

    //Save in BD
    try {
      console.log("A")
      if (movement?.exit_at) {
        const rows = await connection.execute(
          "SELECT * FROM access_key WHERE member_id = ? AND room_id = ? AND access_at = ?",
          [movement?.key_id ?? null, movement?.room_id ?? null, movement?.access_at ?? null]
        );
    
        if ([rows].length > 0) {
          await connection.execute(
            "UPDATE access_key SET exit_at = ? WHERE member_id = ? AND room_id = ? AND access_at = ?",
            [movement?.exit_at ?? null, movement?.key_id ?? null, movement?.room_id ?? null, movement?.access_at ?? null]
          );
        } else {
          await connection.execute(
            "INSERT INTO access_key (member_id, room_id, access_at, exit_at) VALUES (?, ?, ?, ?)",
            [movement?.key_id ?? null, movement?.room_id ?? null, movement?.access_at ?? null, movement?.exit_at ?? null]
          );
        }
      } else {
        await connection.execute(
          "INSERT INTO access_key (member_id, room_id, access_at, exit_at) VALUES (?, ?, ?, null)",
          [movement?.key_id ?? null, movement?.room_id ?? null, movement?.access_at ?? null]
        );
      }
    } catch (error) {
    console.log("B")

      console.error("Error handling packet:", error);
    }
    

    // Send movement to client

    console.log("C")
    
    if (movement?.room_id) {
      
      this.io.emit(event, movement);
      console.log("D")
    } else {
      console.log("E")

      console.log("Error finding users to send movement");
    }
    console.log("F")
    this.isProcessing = false;
    this.processNextPacket();
  }
}
