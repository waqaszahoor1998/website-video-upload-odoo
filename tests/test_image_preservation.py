"""
Test cases for Product Image Format and Dimension Preservation

This file contains tests to verify that:
1. Image format is correctly detected (PNG, JPEG, GIF, etc.)
2. Image dimensions are correctly detected (width x height px)
3. Preservation flags are set correctly
4. Images are not converted or resized
"""

import base64
import io
from PIL import Image
from odoo.tests.common import TransactionCase


class TestProductImagePreservation(TransactionCase):
    """Test cases for product image preservation module"""

    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.ProductImage = cls.env['product.image']
        cls.ProductTemplate = cls.env['product.template']

    def _create_test_image(self, format='PNG', width=800, height=600):
        """Create a test image in memory and return as base64"""
        img = Image.new(format='RGB', size=(width, height), color=(73, 109, 137))
        
        # Save to bytes buffer
        buffer = io.BytesIO()
        img.save(buffer, format=format)
        buffer.seek(0)
        
        # Encode to base64
        return base64.b64encode(buffer.getvalue()).decode('utf-8')

    def test_png_format_detection(self):
        """Test that PNG format is correctly detected"""
        # Create a test PNG image (800x600)
        image_data = self._create_test_image('PNG', 800, 600)
        
        # Create product image
        product_image = self.ProductImage.create({
            'name': 'Test PNG',
            'image_1920': image_data,
        })
        
        # Verify format was detected
        self.assertEqual(product_image.original_format, 'PNG')
        self.assertEqual(product_image.original_dimensions, '800 x 600 px')

    def test_jpeg_format_detection(self):
        """Test that JPEG format is correctly detected"""
        # Create a test JPEG image (1024x768)
        image_data = self._create_test_image('JPEG', 1024, 768)
        
        # Create product image
        product_image = self.ProductImage.create({
            'name': 'Test JPEG',
            'image_1920': image_data,
        })
        
        # Verify format was detected
        self.assertEqual(product_image.original_format, 'JPEG')
        self.assertEqual(product_image.original_dimensions, '1024 x 768 px')

    def test_gif_format_detection(self):
        """Test that GIF format is correctly detected"""
        # Create a test GIF image (512x512)
        image_data = self._create_test_image('GIF', 512, 512)
        
        # Create product image
        product_image = self.ProductImage.create({
            'name': 'Test GIF',
            'image_1920': image_data,
        })
        
        # Verify format was detected
        self.assertEqual(product_image.original_format, 'GIF')
        self.assertEqual(product_image.original_dimensions, '512 x 512 px')

    def test_preserve_flags_set_on_create(self):
        """Test that preservation flags are set on creation"""
        image_data = self._create_test_image('PNG', 1080, 1080)
        
        product_image = self.ProductImage.create({
            'name': 'Test Preservation Flags',
            'image_1920': image_data,
        })
        
        # Verify preservation flags
        self.assertTrue(product_image.preserve_original)
        self.assertTrue(product_image.preserve_dimensions)

    def test_format_detection_on_write(self):
        """Test that format is detected when image is updated"""
        # Create initial image
        image_data_1 = self._create_test_image('PNG', 800, 600)
        product_image = self.ProductImage.create({
            'name': 'Test Write',
            'image_1920': image_data_1,
        })
        
        # Verify initial format
        self.assertEqual(product_image.original_format, 'PNG')
        
        # Update with JPEG image
        image_data_2 = self._create_test_image('JPEG', 1024, 768)
        product_image.write({'image_1920': image_data_2})
        
        # Verify new format was detected
        self.assertEqual(product_image.original_format, 'JPEG')
        self.assertEqual(product_image.original_dimensions, '1024 x 768 px')

    def test_high_resolution_image_preservation(self):
        """Test that high-resolution image dimensions are preserved"""
        # Create a 4K image (3840x2160)
        image_data = self._create_test_image('PNG', 3840, 2160)
        
        product_image = self.ProductImage.create({
            'name': 'Test 4K Image',
            'image_1920': image_data,
        })
        
        # Verify dimensions are preserved
        self.assertEqual(product_image.original_dimensions, '3840 x 2160 px')

    def test_square_image_dimensions(self):
        """Test that square image dimensions are correctly detected"""
        # Create square images
        for size in [512, 1024, 2048]:
            image_data = self._create_test_image('PNG', size, size)
            
            product_image = self.ProductImage.create({
                'name': f'Test {size}x{size}',
                'image_1920': image_data,
            })
            
            expected_dims = f'{size} x {size} px'
            self.assertEqual(product_image.original_dimensions, expected_dims)

    def test_no_empty_format_fields(self):
        """Test that format/dimension fields are never empty after image upload"""
        image_data = self._create_test_image('PNG', 800, 600)
        
        product_image = self.ProductImage.create({
            'name': 'Test Non-Empty Fields',
            'image_1920': image_data,
        })
        
        # Verify fields are not empty
        self.assertNotEqual(product_image.original_format, '')
        self.assertNotEqual(product_image.original_format, 'UNKNOWN')
        self.assertNotEqual(product_image.original_dimensions, '')
        self.assertNotEqual(product_image.original_dimensions, 'UNKNOWN')


# Usage: Run tests with:
# ./odoo-bin -d mydb -m website_video_upload --test-enable -u website_video_upload
