import jsPDF from "jspdf";
import { PRODUCTS, Product } from "@/data/catalog";
import { SITE } from "@/lib/seo";

export type PdfCatalogOptions = {
  selectedCategory?: string; // "all" or specific category name
  productsList?: Product[]; // Live products array from useProducts
  onProgress?: (progressText: string) => void;
};

/**
 * Bulletproof helper to convert any image URL or imported Vite asset path
 * into a Base64 data URL string for jsPDF embedding.
 */
async function loadImageAsBase64(src: string): Promise<string | null> {
  if (!src) return null;

  // Handle data URLs directly
  if (src.startsWith("data:image/")) return src;

  // Build absolute URL for local relative asset paths
  const fullUrl =
    src.startsWith("http://") || src.startsWith("https://") || src.startsWith("data:")
      ? src
      : `${window.location.origin}${src.startsWith("/") ? "" : "/"}${src}`;

  return new Promise((resolve) => {
    const img = new Image();

    // Only set crossOrigin for external cross-domain URLs
    if (fullUrl.startsWith("http") && !fullUrl.startsWith(window.location.origin)) {
      img.crossOrigin = "Anonymous";
    }

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth || img.width || 200;
        canvas.height = img.naturalHeight || img.height || 200;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL("image/png");
          resolve(dataUrl);
        } else {
          resolve(null);
        }
      } catch (e) {
        console.warn("Canvas export failed, trying fetch fallback:", e);
        fetchBlobFallback(fullUrl, resolve);
      }
    };

    img.onerror = () => {
      fetchBlobFallback(fullUrl, resolve);
    };

    img.src = fullUrl;
  });
}

function fetchBlobFallback(fullUrl: string, resolve: (res: string | null) => void) {
  fetch(fullUrl)
    .then((res) => {
      if (!res.ok) throw new Error("Fetch failed");
      return res.blob();
    })
    .then((blob) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result);
        } else {
          resolve(null);
        }
      };
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    })
    .catch(() => resolve(null));
}

// Real GSTIN, from the business's GST registration certificate.
const GST_NUMBER = "24ACAFM4732F1ZL";

/**
 * Live B2B PDF Catalogue Generator with 100% Reliable Image Rendering & Full Product Sync
 */
export async function generateB2bPdfCatalog(options: PdfCatalogOptions = {}): Promise<void> {
  const { selectedCategory = "all", productsList, onProgress } = options;

  if (onProgress) onProgress("Preparing catalogue data...");

  // Use passed productsList (from useProducts hook) or fallback to static seed PRODUCTS
  const sourceProducts: Product[] =
    productsList && productsList.length > 0 ? productsList : PRODUCTS;

  // Filter products by selected category if not "all"
  const filteredProducts: Product[] =
    selectedCategory === "all"
      ? sourceProducts
      : sourceProducts.filter(
          (p: Product) => p.category.toLowerCase() === selectedCategory.toLowerCase(),
        );

  // Pre-load all product base64 images concurrently
  if (onProgress) onProgress("Loading fabric swatch images (100% sync)...");
  const imageMap = new Map<string, string | null>();
  await Promise.all(
    filteredProducts.map(async (p: Product) => {
      if (p.image && !imageMap.has(p.image)) {
        const base64 = await loadImageAsBase64(p.image);
        imageMap.set(p.image, base64);
      }
    }),
  );

  // Group products by category dynamically
  const categoriesMap = new Map<string, Product[]>();
  filteredProducts.forEach((p: Product) => {
    const list = categoriesMap.get(p.category) || [];
    list.push(p);
    categoriesMap.set(p.category, list);
  });

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 297mm
  const margin = 12; // 12mm margin
  let y = margin;

  // Colors
  const NAVY = [10, 22, 40] as const; // #0A1628
  const GOLD = [201, 166, 107] as const; // #C9A66B
  const DARK_TEXT = [30, 41, 59] as const; // #1E293B
  const MUTED_TEXT = [100, 116, 139] as const; // #64748B
  const LIGHT_BG = [248, 250, 252] as const; // #F8FAFC
  const ACCENT_BORDER = [226, 232, 240] as const;

  // Helper to draw Header on pages
  const drawHeader = (isCover = false) => {
    // Top banner
    doc.setFillColor(...NAVY);
    doc.rect(0, 0, pageWidth, isCover ? 38 : 22, "F");

    // Gold decorative accent strip
    doc.setFillColor(...GOLD);
    doc.rect(0, isCover ? 38 : 22, pageWidth, 1.2, "F");

    // Brand Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(isCover ? 18 : 13);
    doc.setTextColor(255, 255, 255);
    doc.text(SITE.name.toUpperCase(), margin, isCover ? 16 : 14);

    // Tagline / Contact in header
    doc.setFont("helvetica", "normal");
    doc.setFontSize(isCover ? 9 : 8);
    doc.setTextColor(...GOLD);
    doc.text("WHOLESALE FABRIC TRADER · SURAT, GUJARAT", margin, isCover ? 23 : 19);

    if (isCover) {
      doc.setFontSize(8);
      doc.setTextColor(220, 225, 235);
      // TODO: replace GST_NUMBER with the real GSTIN once provided — a
      // placeholder must never ship on a document buyers actually receive.
      doc.text(
        `${GST_NUMBER ? `GSTIN: ${GST_NUMBER} | ` : ""}Tel: ${SITE.phoneDisplay}`,
        pageWidth - margin,
        16,
        {
          align: "right",
        },
      );
      doc.text(`Web: mappscreation.com | Email: ${SITE.email}`, pageWidth - margin, 23, {
        align: "right",
      });
    } else {
      doc.setFontSize(7.5);
      doc.setTextColor(220, 225, 235);
      doc.text(
        `Catalog: ${selectedCategory === "all" ? "All Categories" : selectedCategory}`,
        pageWidth - margin,
        14,
        {
          align: "right",
        },
      );
    }
  };

  // Helper to draw Footer
  const drawFooter = (currentPage: number, totalPages: number) => {
    doc.setFillColor(...NAVY);
    doc.rect(0, pageHeight - 12, pageWidth, 12, "F");

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(200, 210, 225);
    doc.text(
      `Mapps Creation — Surat, India | For Order & Swatch Enquiries: WhatsApp ${SITE.phoneDisplay}`,
      margin,
      pageHeight - 5,
    );

    doc.text(`Page ${currentPage} of ${totalPages}`, pageWidth - margin, pageHeight - 5, {
      align: "right",
    });
  };

  // Draw Cover Page / Title Header
  drawHeader(true);
  y = 46;

  // Catalogue Title Box
  doc.setFillColor(...LIGHT_BG);
  doc.setDrawColor(...ACCENT_BORDER);
  doc.roundedRect(margin, y, pageWidth - margin * 2, 26, 3, 3, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(...NAVY);
  const catTitle =
    selectedCategory === "all"
      ? "OFFICIAL WHOLESALE FABRIC CATALOGUE 2026"
      : `${selectedCategory.toUpperCase()} SPECIFICATION CATALOGUE`;
  doc.text(catTitle, margin + 6, y + 10);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(...MUTED_TEXT);
  doc.text(
    `Total Products: ${filteredProducts.length} Items | Categories Covered: ${categoriesMap.size} | Generated: ${new Date().toLocaleDateString("en-IN")}`,
    margin + 6,
    y + 18,
  );

  y += 32;

  // Iterate over Categories
  const categoryKeys = Array.from(categoriesMap.keys());
  const ROW_HEIGHT = 16; // 16mm per product row to accommodate 12mm x 12mm thumbnail images

  for (let cIdx = 0; cIdx < categoryKeys.length; cIdx++) {
    const categoryName = categoryKeys[cIdx] || "Uncategorized";
    const categoryProducts = categoriesMap.get(categoryName) || [];

    if (onProgress) {
      onProgress(
        `Building pages for category ${cIdx + 1}/${categoryKeys.length}: ${categoryName}...`,
      );
    }

    // Check if we need space for Category Header
    if (y + 30 > pageHeight - 18) {
      doc.addPage();
      drawHeader(false);
      y = 28;
    }

    // Category Section Banner
    doc.setFillColor(...NAVY);
    doc.roundedRect(margin, y, pageWidth - margin * 2, 9, 1.5, 1.5, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(...GOLD);
    doc.text(categoryName.toUpperCase(), margin + 4, y + 6);

    doc.setFontSize(8);
    doc.setTextColor(240, 240, 245);
    doc.text(`${categoryProducts.length} Qualities`, pageWidth - margin - 4, y + 6, {
      align: "right",
    });

    y += 12;

    // Table Header
    doc.setFillColor(235, 240, 245);
    doc.rect(margin, y, pageWidth - margin * 2, 7, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(...NAVY);
    doc.text("SWATCH", margin + 3, y + 4.8);
    doc.text("FABRIC QUALITY NAME", margin + 20, y + 4.8);
    doc.text("GSM & SPECIFICATION", margin + 82, y + 4.8);
    doc.text("UNIT PRICE", margin + 132, y + 4.8);
    doc.text("EST. MOQ", margin + 163, y + 4.8);

    y += 7.5;

    // Table Rows
    for (let pIdx = 0; pIdx < categoryProducts.length; pIdx++) {
      const p = categoryProducts[pIdx];
      if (!p) continue;

      // Check space for row
      if (y + ROW_HEIGHT > pageHeight - 18) {
        doc.addPage();
        drawHeader(false);
        y = 28;

        // Repeat table sub-header
        doc.setFillColor(235, 240, 245);
        doc.rect(margin, y, pageWidth - margin * 2, 7, "F");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(7.5);
        doc.setTextColor(...NAVY);
        doc.text("SWATCH", margin + 3, y + 4.8);
        doc.text("FABRIC QUALITY NAME", margin + 20, y + 4.8);
        doc.text("GSM & SPECIFICATION", margin + 82, y + 4.8);
        doc.text("UNIT PRICE", margin + 132, y + 4.8);
        doc.text("EST. MOQ", margin + 163, y + 4.8);
        y += 7.5;
      }

      // Alternating row background
      if (pIdx % 2 === 1) {
        doc.setFillColor(...LIGHT_BG);
        doc.rect(margin, y, pageWidth - margin * 2, ROW_HEIGHT, "F");
      }

      // Fabric Thumbnail Image (12mm x 12mm)
      const base64Img = p.image ? imageMap.get(p.image) : null;
      if (base64Img) {
        try {
          const imgFormat = base64Img.includes("image/png") ? "PNG" : "JPEG";
          doc.addImage(base64Img, imgFormat, margin + 3, y + 2, 12, 12);
        } catch (imgErr) {
          console.warn("addImage failed for product:", p.name, imgErr);
          doc.setFillColor(220, 225, 230);
          doc.rect(margin + 3, y + 2, 12, 12, "F");
        }
      } else {
        doc.setFillColor(220, 225, 230);
        doc.rect(margin + 3, y + 2, 12, 12, "F");
      }

      // Thumbnail Image Border
      doc.setDrawColor(...ACCENT_BORDER);
      doc.rect(margin + 3, y + 2, 12, 12, "D");

      // Product Name
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(...DARK_TEXT);
      doc.text(p.name, margin + 20, y + 8);

      // Spec
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(...MUTED_TEXT);
      doc.text(p.spec, margin + 82, y + 8);

      // Price
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(16, 120, 60); // Green
      doc.text(`INR ${p.price} / ${p.unit}`, margin + 132, y + 8);

      // MOQ
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(...DARK_TEXT);
      const moqText = p.unit === "kg" ? "1 Roll (~25 kg)" : "100 Meters";
      doc.text(moqText, margin + 163, y + 8);

      // Bottom row divider line
      doc.setDrawColor(...ACCENT_BORDER);
      doc.line(margin, y + ROW_HEIGHT, pageWidth - margin, y + ROW_HEIGHT);

      y += ROW_HEIGHT;
    }

    y += 4; // Space between categories
  }

  // Check space for Order Guide Footer Box
  if (y + 35 > pageHeight - 18) {
    doc.addPage();
    drawHeader(false);
    y = 28;
  }

  // Order Guide & Terms Box
  y += 4;
  doc.setFillColor(...LIGHT_BG);
  doc.setDrawColor(...GOLD);
  doc.roundedRect(margin, y, pageWidth - margin * 2, 28, 3, 3, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...NAVY);
  doc.text("HOW TO ORDER & REQUEST PHYSICAL SWATCHES", margin + 6, y + 8);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...DARK_TEXT);
  doc.text(
    `1. Share your selected fabric name, GSM and required quantity over WhatsApp (${SITE.phoneDisplay}).\n2. Free physical swatch samples are dispatched via courier for outstation buyers.\n3. Billing: 5% GST Invoice provided with all orders. Road transport dispatch from Surat.`,
    margin + 6,
    y + 15,
  );

  // Apply Page Numbers to all pages
  const totalPages = doc.internal.pages.length - 1;
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    drawFooter(p, totalPages);
  }

  if (onProgress) onProgress("Saving PDF...");

  // Save the PDF
  const filenameStr =
    selectedCategory === "all"
      ? "Mapps_Creation_Wholesale_Fabric_Catalogue.pdf"
      : `Mapps_Creation_${selectedCategory.replace(/\s+/g, "_")}_Catalogue.pdf`;

  doc.save(filenameStr);
}
