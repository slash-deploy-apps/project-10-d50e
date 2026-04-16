# Product Catalog Capability

## ADDED Requirements

### Requirement: Product Catalog Display

The system MUST display PowerPlaza products organized by category (DC-DC, AC-DC, EV Component) and series, with detailed product pages including specs, images, pricing, and certifications.

#### Scenario: Customer browses product catalog

Given a customer visits the site
When they navigate to the products section
Then they see categories with series listed under each
And they can click into a series to see all products in a table
And they can click a product to see its full details

#### Scenario: Customer views product detail

Given a customer clicks on a product
Then they see the product image, model name, input/output voltage, current, output type, price, certification marks, and datasheet download link

### Requirement: Quote Inquiry System

The system MUST allow customers to select products, specify quantities, and submit quote inquiry forms with their contact information without login.

#### Scenario: Customer submits quote inquiry

Given a customer is on the quote inquiry page
When they add products with quantities and fill in their name, company, email, phone, and message
And they submit the form
Then the inquiry is saved and a confirmation is shown
And the admin receives an email notification

### Requirement: Admin Product Management

The system MUST provide authenticated admin users the ability to create, read, update, and delete products, categories, and series.

#### Scenario: Admin manages products

Given an admin is logged in
When they go to the products management page
Then they can add new products with all specs
And they can edit or delete existing products

#### Scenario: Admin manages categories and series

Given an admin is logged in
When they go to the categories management page
Then they can add, edit, or delete categories and series

### Requirement: Admin Inquiry Management

The system MUST allow admin to view and manage quote inquiries with status tracking.

#### Scenario: Admin reviews inquiry

Given an admin is logged in
When they view the inquiries list
Then they see all inquiries with status (pending/reviewed/replied/closed)
And they can view details including customer info and requested products
And they can update status and add admin notes

### Requirement: Internationalization

The system MUST support Korean and English languages with URL-prefix routing.

#### Scenario: User switches language

Given a user is on any page
When they click the language switcher
Then the page content and URL changes to the selected language
And product data shows in the corresponding language fields

### Requirement: Admin Dashboard

The system MUST provide an admin dashboard showing key metrics and recent activity.

#### Scenario: Admin views dashboard

Given an admin is logged in
When they visit the admin dashboard
Then they see total products count, total inquiries, recent inquiries, and inquiries grouped by status
