# Part of Odoo. See LICENSE file for full copyright and licensing details.

from odoo import api, fields, models


class ProductProduct(models.Model):
    _inherit = 'product.product'

    # Computed fields to access template's video for kanban/list views
    has_video = fields.Boolean(
        compute='_compute_has_video',
        string="Has Video",
    )
    embed_code = fields.Html(
        compute='_compute_embed_code',
        sanitize=False,
    )
    preview_embed_code = fields.Html(
        compute='_compute_preview_embed_code',
        sanitize=False,
    )

    @api.depends('product_tmpl_id.has_video')
    def _compute_has_video(self):
        for product in self:
            product.has_video = product.product_tmpl_id.has_video

    @api.depends('product_tmpl_id.embed_code')
    def _compute_embed_code(self):
        for product in self:
            product.embed_code = product.product_tmpl_id.embed_code

    @api.depends('product_tmpl_id.preview_embed_code')
    def _compute_preview_embed_code(self):
        for product in self:
            product.preview_embed_code = product.product_tmpl_id.preview_embed_code

