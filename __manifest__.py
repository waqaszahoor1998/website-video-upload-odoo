# Part of Odoo. See LICENSE file for full copyright and licensing details.

{
    'name': 'Website Sale Product Video',
    'version': '19.0.1.0.0',
    'category': 'Website/Website',
    'summary': 'Add video support for main product image',
    'description': """
        This module extends the website_sale module to allow adding videos
        instead of images for products. When a video URL is set, it will be
        displayed on the product page instead of the product image.
    """,
    'depends': [
        'website_sale',
    ],
    'data': [
        'views/product_template_views.xml',
        'views/product_template_templates.xml',
    ],
            'assets': {
                'web.assets_frontend': [
                    'website_sale_product_video/static/src/js/product_video_processor.js',
                ],
                'web.assets_backend': [
                    'website_sale_product_video/static/src/css/product_video_form.css',
                ],
            },
    'installable': True,
    'application': False,
    'auto_install': False,
    'license': 'LGPL-3',
}

