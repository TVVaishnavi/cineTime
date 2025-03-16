describe("Theatre Layout Booking", () => {
  beforeEach(() => {
    cy.intercept("GET", "http://localhost:3800/api/all", {
      statusCode: 200,
      body: {
        name: "PVR Cinemas",
        showTime: "7:00 PM",
        movieTitle: "Avengers",
        availableSeats: {
          premium: { rowA: ["A1", "A2"], rowB: ["B1"] },
          regular: { rowC: ["C1", "C2"], rowD: ["D1"] },
          recliner: { rowF: ["F1"] },
        },
        bookedSeats: {
          premium: { rowA: ["A2"], rowB: [] },
          regular: { rowC: [], rowD: [] },
          recliner: { rowF: [] },
        },
      },
    });

    cy.window().then((win) => {
      win.localStorage.setItem(
        "userdetail",
        JSON.stringify({ name: "Test User" })
      );
    });

    cy.visit("/TheatreLayout");
  });

  it("should load theatre layout with available seats", () => {
    cy.contains("PVR Cinemas").should("be.visible");
    cy.get("[data-seat='A1']").should("not.have.class", "booked");
  });

  it("should select and deselect a seat", () => {
    cy.get("[data-seat='A1']").click().should("have.class", "selected");
    cy.get("[data-seat='A1']").click().should("not.have.class", "selected");
  });

  it("should proceed to payment when seats are selected", () => {
    cy.get("[data-seat='A1']").click();
    cy.get(".generate-ticket-btn").should("be.visible").click();
  });
});
