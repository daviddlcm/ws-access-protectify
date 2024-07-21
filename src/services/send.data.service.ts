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
    socket.on("newMovement", (movement) => {
      this.enqueuePacket({ event: "newMovement", movement });
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
    const { event, data } = packet;
    console.log(`Processing ${event} with data:`, data);

    //Save in BD

    try {
      if (data.exit_at) {
        const rows = connection.execute(
          "SELECT * FROM access WHERE member_id = ? AND room_id = ? AND access_at = ?",
          [data.member_id, data.room_id, data.access_at]
        );
        if ([rows].length > 0) {
          connection.execute(
            "UPDATE access SET exit_at = ? WHERE member_id = ? AND room_id = ? AND access_at = ?",
            [data.exit_at, data.member_id, data.room_id, data.access_at]
          );
        } else {
          connection.execute(
            "INSERT INTO access (member_id, room_id, access_at, exit_at) VALUES (?, ?, ?, ?)",
            [data.member_id, data.room_id, data.access_at, data.exit_at]
          );
        }
      } else {
        connection.execute(
          "INSERT INTO access (member_id, room_id, access_at) VALUES (?, ?, ?)",
          [data.member_id, data.room_id, data.access_at]
        );
      }
    } catch (error) {
      console.error("Error handling packet:", error);
    }

    // Send data to client
    
    if (data.id) {
      this.io.to(data.id).emit(event, data);
    } else {
      console.log("Error finding users to send data");
    }
    this.isProcessing = false;
    this.processNextPacket();
  }
}
