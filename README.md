# Google Sheets Clone
## GitHub Repository
[https://github.com/deepak9236/google-sheets-clone](https://github.com/deepak9236/google-sheets-clone)

## Installation and Setup:-
### Backend Setup
1. Clone the repository
   ```
   git clone https://github.com/deepak9236/google-sheets-clone.git
   cd google-sheets-clone/backend
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Create a `.env` file with the following variables
   ```
    NODE_ENV=development
    PORT=5000
    MONGO_URI=mongodb://localhost:27017/googleSheetsClone
   ```

4. Start the server
   ```
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory
   ```
   cd ../frontend
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Create a `.env` file with the following variables
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. Start the development server
   ```
   npm start
   ```

5. Open your browser and navigate to `http://localhost:3000`


## Features

### Spreadsheet Interface
- Responsive grid layout that closely resembles Google Sheets
- Interactive cell selection and editing
- Formula bar for viewing and editing cell content
- Toolbar with formatting options (bold, italic, font size, color)
- Drag functionality for copying cell content and formulas
- Support for adding, deleting, and resizing rows and columns

### Mathematical Functions
- `SUM`: Calculates the sum of a range of cells
- `AVERAGE`: Calculates the average of a range of cells
- `MAX`: Returns the maximum value from a range of cells
- `MIN`: Returns the minimum value from a range of cells
- `COUNT`: Counts the number of cells containing numerical values in a range

### Data Quality Functions
- `TRIM`: Removes leading and trailing whitespace from a cell
- `UPPER`: Converts the text in a cell to uppercase
- `LOWER`: Converts the text in a cell to lowercase
- `REMOVE_DUPLICATES`: Removes duplicate rows from a selected range
- `FIND_AND_REPLACE`: Allows users to find and replace specific text within a range of cells

### Data Entry and Validation
- Support for various data types (numbers, text, dates)
- Real-time data validation for input
- Cell dependency tracking and automatic updates when dependent cells change

### User Management
- User registration and authentication
- Saving and loading user spreadsheets
- Sharing spreadsheets with other users (view/edit permissions)

## Tech Stack & Architecture

### Frontend
- **React.js**: For building a responsive and dynamic user interface
- **Tailwind CSS**: For styling and responsive design
- **Context API**: For state management across components
- **React Router**: For navigation between pages

### Backend
- **Node.js**: Server-side JavaScript runtime
- **Express.js**: Web application framework for Node.js
- **MongoDB**: NoSQL database for storing spreadsheet data
- **Mongoose**: ODM library for MongoDB interactions

## API Endpoints

### Sheets
- `POST /api/sheets` - Create a new sheet
- `GET /api/sheets/:sheetId` - Get a specific sheet
- `GET /api/sheets/user/:userId` - Get all sheets for a user
- `PUT /api/sheets/:sheetId` - Update sheet properties
- `DELETE /api/sheets/:sheetId` - Delete a sheet

### Cells
- `PUT /api/sheets/:sheetId/cell` - Update a single cell
- `PUT /api/sheets/:sheetId/cells` - Update multiple cells



### Prerequisites
- Node.js
- MongoDB
- npm or yarn

## Postman Testing:- Import it
```
{
	"info": {
		"_postman_id": "98460685-4210-4d3b-864d-5a3d97efd7ef",
		"name": "Google Sheets Clone API",
		"description": "Collection of requests for testing the Google Sheets Clone API",
		"schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
		"_exporter_id": "19349818"
	},
	"item": [
		{
			"name": "Create New Sheet",
			"request": {
				"method": "POST",
				"header": [
					{
						"key": "Content-Type",
						"value": "application/json"
					}
				],
				"body": {
					"mode": "raw",
					"raw": "{\n    \"title\": \"My First Spreadsheet\",\n    \"userId\": \"user123\"\n}"
				},
				"url": {
					"raw": "{{baseUrl}}/api/sheets",
					"host": [
						"{{baseUrl}}"
					],
					"path": [
						"api",
						"sheets"
					]
				},
				"description": "Creates a new spreadsheet with the given title and user ID"
			},
			"response": []
		},
		{
			"name": "Get Sheet by ID",
			"request": {
				"method": "GET",
				"header": [],
				"url": {
					"raw": "{{baseUrl}}/api/sheets/{{sheetId}}",
					"host": [
						"{{baseUrl}}"
					],
					"path": [
						"api",
						"sheets",
						"{{sheetId}}"
					]
				},
				"description": "Retrieves a specific sheet by its ID"
			},
			"response": []
		},
		{
			"name": "Get All Sheets for User",
			"request": {
				"method": "GET",
				"header": [],
				"url": {
					"raw": "{{baseUrl}}/api/sheets/user/{{userId}}",
					"host": [
						"{{baseUrl}}"
					],
					"path": [
						"api",
						"sheets",
						"user",
						"{{userId}}"
					]
				},
				"description": "Gets all sheets created by a specific user"
			},
			"response": []
		},
		{
			"name": "Update Single Cell",
			"request": {
				"method": "PUT",
				"header": [
					{
						"key": "Content-Type",
						"value": "application/json"
					}
				],
				"body": {
					"mode": "raw",
					"raw": "{\n    \"row\": 0,\n    \"col\": 0,\n    \"value\": \"Header\",\n    \"formatting\": {\n        \"bold\": true,\n        \"fontSize\": 14\n    }\n}"
				},
				"url": {
					"raw": "{{baseUrl}}/api/sheets/{{sheetId}}/cell",
					"host": [
						"{{baseUrl}}"
					],
					"path": [
						"api",
						"sheets",
						"{{sheetId}}",
						"cell"
					]
				},
				"description": "Updates the value and formatting of a single cell"
			},
			"response": []
		},
		{
			"name": "Update Cell with Formula",
			"request": {
				"method": "PUT",
				"header": [
					{
						"key": "Content-Type",
						"value": "application/json"
					}
				],
				"body": {
					"mode": "raw",
					"raw": "{\n    \"row\": 5,\n    \"col\": 2,\n    \"value\": \"15\",\n    \"formula\": \"=SUM(A1:A5)\"\n}"
				},
				"url": {
					"raw": "{{baseUrl}}/api/sheets/{{sheetId}}/cell",
					"host": [
						"{{baseUrl}}"
					],
					"path": [
						"api",
						"sheets",
						"{{sheetId}}",
						"cell"
					]
				},
				"description": "Updates a cell with a formula"
			},
			"response": []
		},
		{
			"name": "Update Multiple Cells",
			"request": {
				"method": "PUT",
				"header": [
					{
						"key": "Content-Type",
						"value": "application/json"
					}
				],
				"body": {
					"mode": "raw",
					"raw": "{\n    \"cells\": [\n        {\n            \"row\": 1,\n            \"col\": 1,\n            \"value\": \"10\"\n        },\n        {\n            \"row\": 1,\n            \"col\": 2,\n            \"value\": \"20\"\n        },\n        {\n            \"row\": 1,\n            \"col\": 3,\n            \"value\": \"30\"\n        },\n        {\n            \"row\": 2,\n            \"col\": 3,\n            \"formula\": \"=SUM(B2:D2)\",\n            \"value\": \"60\"\n        }\n    ]\n}"
				},
				"url": {
					"raw": "{{baseUrl}}/api/sheets/{{sheetId}}/cells",
					"host": [
						"{{baseUrl}}"
					],
					"path": [
						"api",
						"sheets",
						"{{sheetId}}",
						"cells"
					]
				},
				"description": "Updates multiple cells at once"
			},
			"response": []
		},
		{
			"name": "Update Sheet Properties",
			"request": {
				"method": "PUT",
				"header": [
					{
						"key": "Content-Type",
						"value": "application/json"
					}
				],
				"body": {
					"mode": "raw",
					"raw": "{\n    \"title\": \"Updated Spreadsheet Title\",\n    \"rowCount\": 150,\n    \"colCount\": 30\n}"
				},
				"url": {
					"raw": "{{baseUrl}}/api/sheets/{{sheetId}}",
					"host": [
						"{{baseUrl}}"
					],
					"path": [
						"api",
						"sheets",
						"{{sheetId}}"
					]
				},
				"description": "Updates the properties of a sheet (title, dimensions)"
			},
			"response": []
		},
		{
			"name": "Delete Sheet",
			"request": {
				"method": "DELETE",
				"header": [],
				"url": {
					"raw": "{{baseUrl}}/api/sheets/{{sheetId}}",
					"host": [
						"{{baseUrl}}"
					],
					"path": [
						"api",
						"sheets",
						"{{sheetId}}"
					]
				},
				"description": "Deletes a sheet"
			},
			"response": []
		}
	],
	"event": [
		{
			"listen": "prerequest",
			"script": {
				"type": "text/javascript",
				"exec": [
					""
				]
			}
		},
		{
			"listen": "test",
			"script": {
				"type": "text/javascript",
				"exec": [
					""
				]
			}
		}
	],
	"variable": [
		{
			"key": "baseUrl",
			"value": "http://localhost:5000",
			"type": "string"
		},
		{
			"key": "sheetId",
			"value": "your-sheet-id-here",
			"type": "string"
		},
		{
			"key": "userId",
			"value": "user123",
			"type": "string"
		}
	]
}
```