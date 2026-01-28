import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import api from '../api/api';

export const generateInvoice = async (order) => {
    try {
        if (!order) {
            console.error("No order data provided for invoice generation");
            return;
        }

        // Fetch Branding Info
        let branding = { name: 'MyStore.', logo_url: '' };
        try {
            const brandRes = await api.get('/websites/1');
            branding = brandRes.data;
        } catch (e) {
            console.error("Failed to load branding for invoice");
        }

        const doc = new jsPDF();
        const brandColor = [13, 148, 136]; // Teal color
        const displayId = order.id || order.order_id || 'N/A';

        // Add Logo / Brand Name
        if (branding.logo_url) {
            try {
                // Determine format
                const format = branding.logo_url.toLowerCase().endsWith('.png') ? 'PNG' : 'JPEG';
                doc.addImage(branding.logo_url, format, 20, 10, 40, 15);
            } catch (imgError) {
                // Fallback to text if image fails
                doc.setFontSize(22);
                doc.setTextColor(...brandColor);
                doc.setFont('helvetica', 'bold');
                doc.text(branding.name || 'MyStore.', 20, 20);
            }
        } else {
            doc.setFontSize(22);
            doc.setTextColor(...brandColor);
            doc.setFont('helvetica', 'bold');
            doc.text(branding.name || 'MyStore.', 20, 20);
        }

    // Invoice Header
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Invoice ID: #ORD-${displayId}`, 140, 20);
    doc.text(`Date: ${new Date(order.created_at).toLocaleDateString()}`, 140, 25);

    // Customer Info
    doc.setTextColor(0);
    doc.setFontSize(12);
    doc.text('Bill To:', 20, 45);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(order.customer_name || 'Guest Customer', 20, 52);
    doc.text(order.customer_email || '', 20, 57);
    doc.text(order.shipping_address || '', 20, 62, { maxWidth: 80 });

    // Table
    const tableRows = (order.items || []).map(item => [
        item.product_name,
        item.quantity,
        `$${item.price}`,
        `$${(item.quantity * item.price).toFixed(2)}`
    ]);

    autoTable(doc, {
        startY: 80,
        head: [['Product', 'Qty', 'Unit Price', 'Total']],
        body: tableRows,
        headStyles: { fillColor: brandColor },
        alternateRowStyles: { fillColor: [245, 245, 245] },
    });

    // Summary
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFont('helvetica', 'bold');
    doc.text(`Total Amount: $${Number(order.total_amount).toFixed(2)}`, 140, finalY);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text('Thank you for shopping with us!', 105, finalY + 30, { align: 'center' });

    // Save PDF
    doc.save(`Invoice_ORD_${displayId}.pdf`);
    } catch (error) {
        console.error("PDF Generation Error:", error);
        alert("Failed to generate invoice. Please try again.");
    }
};
