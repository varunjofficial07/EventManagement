import { TicketService } from "../services/ticket.service.js";

export const TicketController = {
  async getMyTickets(req, res) {
    try {
      const tickets = await TicketService.getUserTickets(req.user.id);
      res.json(tickets || []);
    } catch (err) {
      console.error("Error fetching tickets:", err);
      res.status(500).json({ message: err.message || "Failed to fetch tickets" });
    }
  },

  async getTicketById(req, res) {
    try {
      const ticket = await TicketService.getTicket(req.params.id, req.user.id);
      
      if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
      }
      
      res.json(ticket);
    } catch (err) {
      console.error("Error fetching ticket:", err);
      res.status(500).json({ message: err.message });
    }
  },

  async downloadTicket(req, res) {
    try {
      const ticket = await TicketService.getTicket(req.params.id, req.user.id);
      
      if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
      }

      // Set response headers for PDF download
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="ticket-${ticket.ticket_number}.pdf"`);
      
      // TODO: Generate PDF from ticket data
      res.json({ message: "Ticket download not yet implemented" });
    } catch (err) {
      console.error("Error downloading ticket:", err);
      res.status(500).json({ message: err.message });
    }
  },
};