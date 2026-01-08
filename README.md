# Book Explorer App 

A modern React Native application developed with Expo to search for books via the **Google Books API** and view professional reviews via the **New York Times API**.

##  Project Deliverables

* **Installable APK**: [Download from Google Drive](https://drive.google.com/drive/folders/10YkyssQUi-o9nXMS-zdUpZTuw0EzvcLF?usp=sharing)
* **Demo Video**: [Watch on Google Drive](https://drive.google.com/drive/folders/1Hv0ceff9b4_2acXEO509kozXMNb6E0Un?usp=sharing)

##  Key Features
* **Dynamic Search**: Real-time search functionality for books and authors with optimized debouncing.
* **Detailed Metadata**: Displays book covers, titles, authors, and publication years.
* **Rating Integration**: Fetches ISBN-specific reviews and ranks from the NYTimes API.
* **Robust Error Handling**: Implemented "Silent Catch" logic to prevent app crashes and handle API limits gracefully.
* **Figma-Matched UI**: Clean, borderless design with custom `#55d4ae` branding and Safe Area management for modern Android devices.

##  Technical Implementation & Setup
1. **Clone the Repo**: `git clone https://github.com/shahryar-dev/BookSearchApp.git`
2. **Install Dependencies**: `npm install`
3. **Run Locally**: `npx expo start`
4. **Testing (Requirement 5)**: Run `npm test` to execute unit tests for the `BookService` API logic.