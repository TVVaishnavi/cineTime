describe("Theatre Selection Page", () => {
  beforeEach(() => {
    cy.intercept("POST", "http://localhost:3800/api/movies/", (req) => {
      req.reply({
        statusCode: 200,
        body: [
          {
            title: "Dragon",
            theatres: [
              {
                name: "PVR Cinemas",
                location: "Downtown",
                showTimes: [
                  { time: "10:30am", availableSeats: { premium: ["A1"] }, bookedSeats: ["A1"] },
                  { time: "1:00pm", availableSeats: { regular: ["C1"] }, bookedSeats: [] },
                  { time: "4:30pm", availableSeats: { recliner: ["F1"] }, bookedSeats: [] }
                ]
              }
            ]
          }
        ]
      });
    }).as("getTheatres");

    cy.visit("/TheatreSelect/Dragon");
    cy.wait("@getTheatres");
    cy.percySnapshot("Theatre Selection - Initial Load");
  });

  it("should display all available theatres for the selected movie", () => {
    cy.contains("h2", "Available Theatres for Dragon").should("be.visible");
    cy.get(".theatre-box").should("have.length", 1);
    cy.contains(".theatre-name", "PVR Cinemas").should("be.visible");
    cy.contains(".theatre-location", "Downtown").should("be.visible");
    cy.percySnapshot("Theatre Selection - Theatres Displayed");
  });

  it("should display available showtimes", () => {
    cy.get(".showtime-btn").should("have.length", 3);
    cy.contains(".showtime-btn", "10:30am").should("be.visible");
    cy.contains(".showtime-btn", "1:00pm").should("be.visible");
    cy.contains(".showtime-btn", "4:30pm").should("be.visible");
    cy.percySnapshot("Theatre Selection - Showtimes Displayed");
  });

  it("should navigate to TheatreLayout when a showtime is selected", () => {
    cy.get(".showtime-btn").first().click();
    cy.location("pathname").should("include", "/TheatreLayout");
    cy.percySnapshot("Theatre Selection - Navigated to TheatreLayout");
  });

  it("should show error message if API fails", () => {
    cy.intercept("POST", "http://localhost:3800/api/movies/", {
      statusCode: 500,
      body: { error: "Server Error" }
    }).as("getTheatresFail");

    cy.visit("/TheatreSelect/Dragon");
    cy.wait("@getTheatresFail");

    cy.get(".error-message").should("exist").contains("Error").should("be.visible");
    cy.percySnapshot("Theatre Selection - API Error");
  });
});
