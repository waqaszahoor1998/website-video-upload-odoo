# Website Sale Product Video

This module extends the `website_sale` module to allow adding videos instead of images for products.

## Features

- Add a video URL field to product templates
- Display video on product pages instead of images when a video URL is set
- Automatic thumbnail generation from video URL
- Video preview in the product form
- Support for YouTube, Vimeo, and other video platforms

## Installation

1. Copy this module to your Odoo addons directory
2. Update the apps list in Odoo
3. Install the "Website Sale Product Video" module

## Usage

1. Go to a product form (Sales > Products > Products)
2. In the "eCommerce Media" section, you'll see a "Product Video (Alternative to Image)" field
3. Enter a video URL (e.g., YouTube or Vimeo URL)
4. The video will be displayed on the product page instead of the product image
5. If no image is set, a thumbnail will be automatically generated from the video

## Technical Details

This module inherits from:
- `product.template` model to add video fields
- Product form view to add video URL input
- Product page templates to display videos

## License

LGPL-3

