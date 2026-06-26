import { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Search, 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  Check, 
  ChevronRight, 
  CreditCard, 
  Phone, 
  ShieldCheck, 
  Truck, 
  Percent, 
  Star, 
  Building2, 
  Sparkles, 
  CheckCircle2,
  Wrench,
  ArrowRight,
  Play,
  X,
  Info,
  ArrowLeft
} from 'lucide-react';
import './App.css';

// Preloaded B2B Product Catalog with full specifications
const CATALOG_PRODUCTS = [
  {
    id: 1,
    name: "Astral CPVC Pro Pipe (SDR 11)",
    brand: "Astral",
    category: "Plumbing",
    specs: "3/4 inch (20mm), 3 Meter length, Class 1, NSF-certified",
    longSpecs: "Astral CPVC Pro pipes are designed for hot and cold water distribution. Produced from special chlorinated polyvinyl chloride compound, it offers high temperature resistance (up to 93°C) and superior tensile strength. Recommended for residential and commercial multi-story plumbing grids.",
    price: 360,
    gstRate: 18,
    image: "/plumbing.jpg",
    minBulkQty: 25,
    bulkPrice: 325,
    stock: "1,200 pcs"
  },
  {
    id: 2,
    name: "Brass Ball Valve (Premium Heavy)",
    brand: "Astral",
    category: "Plumbing",
    specs: "1 inch (25mm), Female-threaded, PN16 rating, Solid forged brass",
    longSpecs: "Industrial-grade forged brass ball valve with double O-ring stem seals and corrosion-resistant nickel plating. Offers bubble-tight shutoff for high-pressure water mainlines. Features a heavy-duty steel lever handle with thermal vinyl sleeve.",
    price: 420,
    gstRate: 18,
    image: "/plumbing.jpg",
    minBulkQty: 15,
    bulkPrice: 380,
    stock: "450 pcs"
  },
  {
    id: 3,
    name: "Bosch Cordless Impact Drill GSB 180-LI",
    brand: "Bosch",
    category: "Tools",
    specs: "18V Lithium-Ion, 13mm Chuck, 2x 2.0Ah Batteries, Heavy Case",
    longSpecs: "Professional 18V impact driver/drill offering high torque (54/21 Nm) for masonry, steel, and wood boring. Features brush change access, motor protection sensors, and built-in LED workspace illumination. Perfect for civil installations and onsite carpentry.",
    price: 6499,
    gstRate: 18,
    image: "/tools.jpg",
    minBulkQty: 5,
    bulkPrice: 5999,
    stock: "48 units"
  },
  {
    id: 4,
    name: "Bosch Professional Angle Grinder GWS 600",
    brand: "Bosch",
    category: "Tools",
    specs: "4 inch (100mm) wheel, 670W input motor, 11,000 RPM",
    longSpecs: "Heavy-duty compact angle grinder designed for steel deburring, weld grinding, and masonry cutting. Equipped with armored coils, safety guard locks, and ergonomic barrel grip. Includes auxiliary handle and grinding wheel wrench.",
    price: 2350,
    gstRate: 18,
    image: "/tools.jpg",
    minBulkQty: 8,
    bulkPrice: 2150,
    stock: "85 units"
  },
  {
    id: 5,
    name: "Tata Tiscon TMT Steel Rebars Fe 550D",
    brand: "Tata",
    category: "Fasteners",
    specs: "12mm diameter, Standard length of 12m, High-strength structural grade",
    longSpecs: "Tata Tiscon Fe 550D high-strength rebars are made through advanced thermo-mechanical treatment. They exhibit superior ductility, excellent bond strength with concrete, and high seismic earthquake resistance. Ideal for load-bearing pillars, slabs, and foundations.",
    price: 680,
    gstRate: 18,
    image: "/hero.jpg",
    minBulkQty: 50,
    bulkPrice: 630,
    stock: "5,000 kgs"
  },
  {
    id: 6,
    name: "Tata Premium Galvanized Nails (5Kg Box)",
    brand: "Tata",
    category: "Fasteners",
    specs: "3 inch length, Rustproof hot-dip galvanized carbon steel coating",
    longSpecs: "Standard wholesale wood construction nails with flat checkered heads and diamond point tips. Manufactured using premium steel wire to prevent bending. Hot-dip galvanization provides superior moisture resistance for external centering work.",
    price: 490,
    gstRate: 18,
    image: "/hero.jpg",
    minBulkQty: 10,
    bulkPrice: 440,
    stock: "200 boxes"
  },
  {
    id: 7,
    name: "Self-Tapping Metal Screws",
    brand: "Tata",
    category: "Fasteners",
    specs: "8x25mm size, Box of 500 pieces, Zinc plated steel",
    longSpecs: "Premium self-drilling screws for sheet metal cladding, framing, and steel partitioning. Features a sharp drill point that punctures, taps, and fastens in one operation. Corrosion-resistant blue passivated zinc plating.",
    price: 350,
    gstRate: 18,
    image: "/hero.jpg",
    minBulkQty: 20,
    bulkPrice: 310,
    stock: "600 boxes"
  },
  {
    id: 8,
    name: "Finolex 3-Core Flexible Copper Cable",
    brand: "Finolex",
    category: "Electrical",
    specs: "1.5 Sq mm cross section, 90m Roll, FR-PVC Insulated",
    longSpecs: "Flame Retardant (FR) PVC insulated multi-strand copper industrial cable. Designed for high conductivity and heat resistance in electrical panel wiring and power transmission conduits. Meets IS 694 standards.",
    price: 1850,
    gstRate: 18,
    image: "/tools.jpg",
    minBulkQty: 10,
    bulkPrice: 1690,
    stock: "180 rolls"
  },
  {
    id: 9,
    name: "Birla White WallCare Putty",
    brand: "Birla White",
    category: "Paint & Putty",
    specs: "Extra water resistant, 40 Kg heavy bag, Polymer modified",
    longSpecs: "Birla White WallCare putty is a polymer-modified, white cement-based base coat formulated to prevent moisture infiltration and paint peeling. It fills pores, cracks, and offers a smooth protective base for internal and external painting projects.",
    price: 1150,
    gstRate: 18,
    image: "/hero.jpg",
    minBulkQty: 15,
    bulkPrice: 1060,
    stock: "350 bags"
  }
];

function App() {
  // Navigation tabs state synchronized with window hash
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Suggestion dropdown states
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchInputRef = useRef(null);

  // Quote cart state loaded from localStorage
  const [quoteItems, setQuoteItems] = useState(() => {
    const saved = localStorage.getItem('apex_quote_items');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [quoteNotes, setQuoteNotes] = useState(() => {
    return localStorage.getItem('apex_quote_notes') || '';
  });

  // Toast message states
  const [toastMessage, setToastMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);

  // Product detailed modal states
  const [activeProductModal, setActiveProductModal] = useState(null);

  // Expanded video modal states
  const [isHeroExpanded, setIsHeroExpanded] = useState(false);

  // Credit wizard onboarding states
  const [creditStep, setCreditStep] = useState(1);
  const [creditForm, setCreditForm] = useState(() => {
    const saved = localStorage.getItem('apex_credit_form');
    return saved ? JSON.parse(saved) : {
      contractorName: '',
      businessName: '',
      gstin: '',
      pan: '',
      monthlyVolume: '₹1 Lakh - ₹5 Lakhs',
      creditDays: '30 Days',
      phone: ''
    };
  });
  const [creditSubmitted, setCreditSubmitted] = useState(() => {
    return localStorage.getItem('apex_credit_submitted') === 'true';
  });

  // Credit eligibility calculator states
  const [calcVolume, setCalcVolume] = useState(500000);
  const [calcDays, setCalcDays] = useState(30);

  // Validation errors
  const [formErrors, setFormErrors] = useState({});

  // YouTube placeholder URLs
  const YOUTUBE_URL = "https://www.youtube.com/watch?v=NmdRLDRjogk";
  const YOUTUBE_EMBED = "https://www.youtube.com/embed/NmdRLDRjogk";

  // Persistent synchronizations
  useEffect(() => {
    localStorage.setItem('apex_quote_items', JSON.stringify(quoteItems));
  }, [quoteItems]);

  useEffect(() => {
    localStorage.setItem('apex_quote_notes', quoteNotes);
  }, [quoteNotes]);

  useEffect(() => {
    localStorage.setItem('apex_credit_form', JSON.stringify(creditForm));
  }, [creditForm]);

  useEffect(() => {
    localStorage.setItem('apex_credit_submitted', creditSubmitted ? 'true' : 'false');
  }, [creditSubmitted]);

  // Click outside search auto-suggestions
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchInputRef.current && !searchInputRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Hash router synchronization (provides back/forward navigation support)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash && ['home', 'catalog', 'quote', 'credit'].includes(hash)) {
        setActiveTab(hash);
      } else {
        setActiveTab('home');
        window.location.hash = 'home';
      }
    };
    
    window.addEventListener('hashchange', handleHashChange);
    
    // Set initial hash route
    if (!window.location.hash) {
      window.location.hash = 'home';
    } else {
      handleHashChange();
    }
    
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Sync scroll to top on tab changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  // Escape key overlay close trigger
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsHeroExpanded(false);
        setActiveProductModal(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Toast alert
  const showToast = (msg) => {
    setToastMessage(msg);
    setToastVisible(true);
    setTimeout(() => {
      setToastVisible(false);
    }, 2500);
  };

  // Categories list
  const categories = useMemo(() => {
    const cats = new Set(CATALOG_PRODUCTS.map(p => p.category));
    return ['All', ...Array.from(cats)];
  }, []);

  // Search auto-suggestions
  const searchSuggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return CATALOG_PRODUCTS.filter(product => 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 5);
  }, [searchQuery]);

  // Filter products
  const filteredProducts = useMemo(() => {
    return CATALOG_PRODUCTS.filter(product => {
      const matchCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.specs.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Quote cart updates
  const addToQuote = (product, qtyToAdd = 1) => {
    setQuoteItems(prevItems => {
      const existing = prevItems.find(item => item.id === product.id);
      if (existing) {
        return prevItems.map(item => 
          item.id === product.id ? { ...item, qty: item.qty + qtyToAdd } : item
        );
      }
      return [...prevItems, { ...product, qty: qtyToAdd }];
    });
    showToast(`Added ${qtyToAdd}x ${product.name} to cart!`);
  };

  const updateQty = (id, newQty) => {
    if (newQty <= 0) {
      removeFromQuote(id);
      return;
    }
    setQuoteItems(prevItems => 
      prevItems.map(item => item.id === id ? { ...item, qty: newQty } : item)
    );
  };

  const removeFromQuote = (id) => {
    const item = quoteItems.find(i => i.id === id);
    setQuoteItems(prevItems => prevItems.filter(item => item.id !== id));
    if (item) {
      showToast(`Removed ${item.name} from cart.`);
    }
  };

  // Pricing math
  const pricingSummary = useMemo(() => {
    let subtotal = 0;
    let totalGst = 0;
    
    quoteItems.forEach(item => {
      const rate = (item.qty >= item.minBulkQty) ? item.bulkPrice : item.price;
      const itemSub = rate * item.qty;
      const itemGst = itemSub * (item.gstRate / 100);
      subtotal += itemSub;
      totalGst += itemGst;
    });

    const totalQty = quoteItems.reduce((acc, item) => acc + item.qty, 0);
    
    let discountRate = 0;
    if (totalQty >= 50) discountRate = 0.10;
    else if (totalQty >= 20) discountRate = 0.05;
    
    const grossAmount = subtotal + totalGst;
    const discountAmount = grossAmount * discountRate;
    const finalTotal = grossAmount - discountAmount;

    return {
      subtotal,
      cgst: totalGst / 2,
      sgst: totalGst / 2,
      totalGst,
      grossAmount,
      discountRate: discountRate * 100,
      discountAmount,
      finalTotal,
      totalQty
    };
  }, [quoteItems]);

  // WhatsApp checkout builder
  const handleWhatsAppSend = () => {
    if (quoteItems.length === 0) return;

    let text = `*APEX BUILD MART - WHOLESALE INQUIRY CHECKOUT*\n`;
    text += `===================================\n\n`;
    text += `Hello, I want to confirm price and stock availability for the following site requirements:\n\n`;

    quoteItems.forEach((item, index) => {
      const isBulk = item.qty >= item.minBulkQty;
      const rate = isBulk ? item.bulkPrice : item.price;
      const lineTotal = rate * item.qty;
      
      text += `${index + 1}. *[${item.brand}]* ${item.name}\n`;
      text += `   Specs: ${item.specs}\n`;
      text += `   Qty: *${item.qty}* | Rate: ₹${rate}${isBulk ? ' (Wholesale Tier)' : ''} | Sub: ₹${lineTotal}\n\n`;
    });

    text += `===================================\n`;
    text += `*ESTIMATED B2B BILL BREAKDOWN*\n`;
    text += `Items Subtotal: ₹${pricingSummary.subtotal.toFixed(2)}\n`;
    text += `Total GST (18%): ₹${pricingSummary.totalGst.toFixed(2)}\n`;
    if (pricingSummary.discountRate > 0) {
      text += `Bulk Volume Discount (${pricingSummary.discountRate}%): -₹${pricingSummary.discountAmount.toFixed(2)}\n`;
    }
    text += `*Estimated Grand Total: ₹${pricingSummary.finalTotal.toFixed(2)}*\n\n`;

    if (quoteNotes.trim()) {
      text += `*Delivery Notes & Instructions:*\n_"${quoteNotes}"_\n\n`;
    }

    text += `_Please review and send back formal tax invoice with transit cost. Thank you!_`;

    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/919999999999?text=${encodedText}`, '_blank');
  };

  // Form validations
  const validateFormStep = () => {
    const errors = {};
    if (creditStep === 1) {
      if (!creditForm.contractorName.trim()) errors.contractorName = "Owner's name is required";
      if (!creditForm.businessName.trim()) errors.businessName = "Business/Company name is required";
      if (creditForm.gstin.trim()) {
        const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
        if (!gstRegex.test(creditForm.gstin.toUpperCase())) {
          errors.gstin = "Invalid GSTIN format (e.g. 07AAAAA1111A1Z1)";
        }
      }
    } else if (creditStep === 3) {
      if (!creditForm.phone.trim()) {
        errors.phone = "Phone number is required";
      } else if (!/^[0-9]{10}$/.test(creditForm.phone)) {
        errors.phone = "Phone must be a valid 10-digit number";
      }
      
      if (creditForm.pan.trim()) {
        const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
        if (!panRegex.test(creditForm.pan.toUpperCase())) {
          errors.pan = "Invalid PAN number format (e.g. ABCDE1234F)";
        }
      }
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreditFieldChange = (e) => {
    const { name, value } = e.target;
    setCreditForm(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const nextCreditStep = (e) => {
    e.preventDefault();
    if (!validateFormStep()) return;

    if (creditStep < 3) {
      setCreditStep(prev => prev + 1);
    } else {
      setCreditSubmitted(true);
      showToast("B2B Credit Application submitted!");
    }
  };

  const prevCreditStep = () => {
    if (creditStep > 1) {
      setCreditStep(prev => prev - 1);
    }
  };

  const handleResetCredit = () => {
    setCreditForm({
      contractorName: '',
      businessName: '',
      gstin: '',
      pan: '',
      monthlyVolume: '₹1 Lakh - ₹5 Lakhs',
      creditDays: '30 Days',
      phone: ''
    });
    setCreditSubmitted(false);
    setCreditStep(1);
    setFormErrors({});
  };

  // Hero player toggle
  const handleHeroClick = () => {
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      window.open(YOUTUBE_URL, '_blank');
    } else {
      setIsHeroExpanded(!isHeroExpanded);
    }
  };

  // Credit limit calculations
  const estimatedCreditLimit = useMemo(() => {
    const factor = calcDays === 15 ? 1.2 : calcDays === 30 ? 1.0 : 0.8;
    const computed = calcVolume * 0.6 * factor;
    return Math.max(25000, Math.min(1500000, computed));
  }, [calcVolume, calcDays]);

  return (
    <>
      {/* Brand Header */}
      <header className="navbar">
        <a href="#home" onClick={() => { window.location.hash = 'home'; setSelectedCategory('All'); }} className="nav-brand">
          <Building2 size={24} style={{ color: 'var(--primary)' }} />
          APEX <span>BUILD MART</span>
        </a>
        <div className="nav-status">
          <span className="badge badge-success">
            <span className="status-dot"></span>
            Delivering NCR & Noida
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className="container animate-fade-in">
        
        {/* TAB 1: HOME PAGE */}
        {activeTab === 'home' && (
          <div className="animate-slide-up">
            
            {/* Hero Section */}
            <section className="hero-section">
              <div className="hero-content">
                <div className="hero-badge">
                  <span className="badge badge-primary">
                    <Sparkles size={12} style={{ marginRight: '4px' }} />
                    India's Tech-Enabled B2B Partner
                  </span>
                </div>
                <h1 className="hero-title">
                  Wholesale Building Materials <span>Direct to Site</span>
                </h1>
                <p className="hero-description">
                  Apex Build Mart simplifies bulk sourcing for civil contractors and builders. Browse our digital catalog, calculate exact GST rates instantly, and get site delivery on custom credit terms.
                </p>
                <div className="hero-ctas">
                  <button className="btn btn-primary" onClick={() => { window.location.hash = 'catalog'; }}>
                    Browse Catalog
                    <ArrowRight size={18} />
                  </button>
                  <button className="btn btn-secondary" onClick={() => { window.location.hash = 'credit'; }}>
                    Apply B2B Credit
                  </button>
                </div>
                
                <div className="hero-features">
                  <div className="hero-feat-item">
                    <ShieldCheck size={16} />
                    <span>100% Brand Warranted Stock</span>
                  </div>
                  <div className="hero-feat-item">
                    <Truck size={16} />
                    <span>Same-day Site Logistics</span>
                  </div>
                  <div className="hero-feat-item">
                    <Percent size={16} />
                    <span>Direct Bulk Pricing</span>
                  </div>
                  <div className="hero-feat-item">
                    <CreditCard size={16} />
                    <span>Flexible Credit Lines</span>
                  </div>
                </div>
              </div>
              
              {/* Collapse/Collapsed Card Hero component */}
              <div className="hero-visual">
                <div 
                  className="expandable-hero-card"
                  onClick={handleHeroClick}
                >
                  <div className="card-collapsed-content">
                    <img 
                      src="/hero.jpg" 
                      alt="Click to watch construction site setup video overview" 
                      className="hero-card-img"
                    />
                    <div className="hero-card-overlay">
                      <div className="play-button-wrapper">
                        <Play size={24} fill="white" />
                      </div>
                      <div className="hero-overlay-text">
                        <h4>Apex Logistics & Supply Chain Overview</h4>
                        <p>Click to watch our site delivery system in action (YouTube)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Premium ROI Features Pitch Grid */}
            <section className="features-grid">
              <div className="feat-card glass-card">
                <div className="feat-icon-box">
                  <Phone size={24} />
                </div>
                <h3>WhatsApp-First Checkout</h3>
                <p>No tedious e-commerce checkouts. Build your list, click, and export a structured order bill straight to our WhatsApp sales line.</p>
              </div>

              <div className="feat-card glass-card">
                <div className="feat-icon-box">
                  <Percent size={24} />
                </div>
                <h3>Live GST Estimator</h3>
                <p>See the exact billing breakdowns including CGST, SGST, and automatic wholesale tier discounts. Compliant with audit requirements.</p>
              </div>

              <div className="feat-card glass-card">
                <div className="feat-icon-box">
                  <Building2 size={24} />
                </div>
                <h3>B2B 'Udhaar' portal</h3>
                <p>Submit digital KYC details to unlock a 15-45 day rotating credit limit. Scale your project procurement without liquid cash drag.</p>
              </div>
            </section>

            {/* Featured brands */}
            <section className="brands-showcase-section">
              <h3 className="showcase-title">
                Authorized Wholesale Distributors
              </h3>
              <div className="brands-logo-row">
                <div className="brand-logo-badge" onClick={() => { window.location.hash = 'catalog'; setSelectedCategory('Plumbing'); }}>
                  <span>ASTRAL</span>
                  <p>CPVC & PVC Pipes</p>
                </div>
                <div className="brand-logo-badge" onClick={() => { window.location.hash = 'catalog'; setSelectedCategory('Tools'); }}>
                  <span>BOSCH</span>
                  <p>Power Tools</p>
                </div>
                <div className="brand-logo-badge" onClick={() => { window.location.hash = 'catalog'; setSelectedCategory('Fasteners'); }}>
                  <span>TATA STEEL</span>
                  <p>TMT & Fasteners</p>
                </div>
                <div className="brand-logo-badge" onClick={() => { window.location.hash = 'catalog'; setSelectedCategory('Electrical'); }}>
                  <span>FINOLEX</span>
                  <p>Industrial Cable</p>
                </div>
                <div className="brand-logo-badge" onClick={() => { window.location.hash = 'catalog'; setSelectedCategory('Paint & Putty'); }}>
                  <span>BIRLA WHITE</span>
                  <p>WallPutty</p>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* TAB 2: PRODUCT CATALOG */}
        {activeTab === 'catalog' && (
          <section className="catalog-section animate-slide-up">
            {/* Visual Back Navigation */}
            <button onClick={() => { window.location.hash = 'home'; }} className="btn-back-nav">
              <ArrowLeft size={16} style={{ marginRight: '6px' }} />
              Back to Home
            </button>

            <div className="section-header">
              <h2>Wholesale Product Catalog</h2>
              <p>Search standard B2B materials, view technical specifications, and add quantities to your quotation invoice.</p>
            </div>

            {/* Catalog Controls */}
            <div className="catalog-controls">
              <div className="search-wrapper" ref={searchInputRef}>
                <Search size={18} className="search-icon" />
                <input 
                  type="text" 
                  className="form-input search-input" 
                  placeholder="Search Astral, Bosch, Tata..." 
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                />
                
                {/* Search suggestion drop-down */}
                {showSuggestions && searchSuggestions.length > 0 && (
                  <div className="search-suggestions-dropdown">
                    {searchSuggestions.map(product => (
                      <div 
                        key={product.id} 
                        className="suggestion-item"
                        onClick={() => {
                          setSearchQuery(product.name);
                          setShowSuggestions(false);
                        }}
                      >
                        <span className="suggestion-name">{product.name}</span>
                        <span className="suggestion-brand">{product.brand}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="category-tabs">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`tab-btn ${selectedCategory === cat ? 'active' : ''}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Catalog Product Grid */}
            <div className="products-grid">
              {filteredProducts.length > 0 ? (
                filteredProducts.map(product => (
                  <div key={product.id} className="product-card">
                    {/* Card Body triggers detail modal */}
                    <div 
                      className="product-card-clickable"
                      onClick={() => setActiveProductModal(product)}
                    >
                      <div className="product-thumb-wrapper">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="product-thumb"
                        />
                        <span className="hover-detail-badge">
                          <Info size={12} /> Specs
                        </span>
                      </div>
                      
                      <div className="product-card-body">
                        <span className="product-brand">{product.brand}</span>
                        <h4 className="product-name">{product.name}</h4>
                        <p className="product-specs">{product.specs}</p>
                      </div>
                    </div>

                    <div className="product-card-footer">
                      <div className="product-price-box">
                        <span className="price-label">Retail B2B Rate</span>
                        <span className="price-value">₹{product.price}</span>
                        <span className="price-gst-tag">+{product.gstRate}% GST</span>
                        <span className="bulk-price-incentive">₹{product.bulkPrice} for {product.minBulkQty}+ pcs</span>
                      </div>

                      <button 
                        className="btn-add-quote"
                        onClick={() => addToQuote(product)}
                      >
                        <Plus size={16} />
                        Add
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                  <Wrench size={40} style={{ marginBottom: '16px', opacity: '0.5' }} />
                  <p>No products found matching your criteria.</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* TAB 3: GST ESTIMATOR & QUOTE CHECKOUT */}
        {activeTab === 'quote' && (
          <section className="quote-section animate-slide-up">
            {/* Visual Back Navigation */}
            <button onClick={() => { window.location.hash = 'catalog'; }} className="btn-back-nav">
              <ArrowLeft size={16} style={{ marginRight: '6px' }} />
              Back to Catalog
            </button>

            <div className="section-header">
              <h2>GST Estimator & Cart</h2>
              <p>Review quantities, view item-level GST breakdowns, unlock bulk discounts, and send request directly to WhatsApp.</p>
            </div>

            <div className="calculator-wrapper">
              {/* Quotation Table */}
              <div className="glass-card" style={{ padding: '16px', overflow: 'hidden' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', paddingLeft: '8px' }}>Active Quote Items</h3>
                
                {quoteItems.length > 0 ? (
                  <div className="items-table-container">
                    <table className="items-table">
                      <thead>
                        <tr>
                          <th>Material Details</th>
                          <th style={{ textAlign: 'center' }}>Qty</th>
                          <th>Unit Price</th>
                          <th style={{ textAlign: 'right' }}>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {quoteItems.map(item => {
                          const isBulk = item.qty >= item.minBulkQty;
                          const rate = isBulk ? item.bulkPrice : item.price;
                          return (
                            <tr key={item.id}>
                              <td>
                                <div className="cart-item-name">{item.name}</div>
                                <div className="cart-item-meta">
                                  <span>Brand: {item.brand}</span>
                                  <span>GST: {item.gstRate}%</span>
                                  {isBulk && <span className="bulk-badge-inline">Bulk Price Applied</span>}
                                </div>
                              </td>
                              <td style={{ textAlign: 'center' }}>
                                <div className="qty-control-row">
                                  <button 
                                    className="btn-remove-item"
                                    onClick={() => updateQty(item.id, item.qty - 1)}
                                    aria-label="Decrease quantity"
                                  >
                                    <Minus size={14} />
                                  </button>
                                  <span className="qty-val">{item.qty}</span>
                                  <button 
                                    className="btn-remove-item"
                                    onClick={() => updateQty(item.id, item.qty + 1)}
                                    aria-label="Increase quantity"
                                  >
                                    <Plus size={14} style={{ color: 'var(--primary)' }} />
                                  </button>
                                </div>
                              </td>
                              <td>
                                <div className="price-col">
                                  <span>₹{rate}</span>
                                  {!isBulk && <span className="bulk-incent-tip">({item.minBulkQty}+ for ₹{item.bulkPrice})</span>}
                                </div>
                              </td>
                              <td style={{ textAlign: 'right' }}>
                                <div className="total-col">
                                  <span style={{ fontWeight: '600' }}>₹{rate * item.qty}</span>
                                  <button 
                                    className="btn-delete-cart-item"
                                    onClick={() => removeFromQuote(item.id)}
                                    aria-label="Delete item"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="empty-quote-state">
                    <ShoppingCart size={48} />
                    <p style={{ fontWeight: '600', marginBottom: '8px' }}>Your quotation cart is empty</p>
                    <p style={{ fontSize: '0.85rem', marginBottom: '20px' }}>Select B2B hardware and tools from our catalog.</p>
                    <button className="btn btn-primary" onClick={() => { window.location.hash = 'catalog'; }}>
                      Add Products
                    </button>
                  </div>
                )}
              </div>

              {/* Bill Details Summary */}
              <div className="summary-box">
                <h3 className="summary-title">B2B GST Estimation</h3>
                
                <div className="summary-row">
                  <span>Gross Materials Value:</span>
                  <span>₹{pricingSummary.subtotal.toLocaleString('en-IN')}</span>
                </div>

                <div className="summary-row">
                  <div>
                    <span>Total GST Input Split:</span>
                    <div className="tax-badge-row">
                      <span className="tax-micro-badge">CGST (9%): ₹{pricingSummary.cgst.toLocaleString('en-IN')}</span>
                      <span className="tax-micro-badge">SGST (9%): ₹{pricingSummary.sgst.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                  <span>₹{pricingSummary.totalGst.toLocaleString('en-IN')}</span>
                </div>

                {pricingSummary.discountRate > 0 ? (
                  <div className="summary-row discount" style={{ color: 'var(--success)' }}>
                    <span>Wholesale Volume Discount ({pricingSummary.discountRate}%):</span>
                    <span>-₹{pricingSummary.discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                ) : (
                  <div className="discount-callout">
                    <Percent size={16} />
                    <div>
                      <strong>Volume discount checklist</strong>
                      <p style={{ fontSize: '0.75rem', marginTop: '2px', color: 'var(--text-secondary)' }}>Buy 20+ total items to unlock a 5% discount, 50+ total items for 10% off final billing.</p>
                    </div>
                  </div>
                )}

                <div className="summary-row total">
                  <span>Estimated Billing:</span>
                  <span>₹{pricingSummary.finalTotal.toLocaleString('en-IN')}</span>
                </div>

                <div className="form-group" style={{ marginTop: '20px' }}>
                  <label className="form-label">Site Delivery Instructions (Optional)</label>
                  <textarea 
                    className="form-textarea" 
                    placeholder="e.g. Delivery at Sector-63 construction site, need credit billing."
                    value={quoteNotes}
                    onChange={(e) => setQuoteNotes(e.target.value)}
                    rows="3"
                  ></textarea>
                </div>

                <button 
                  className="btn btn-whatsapp" 
                  disabled={quoteItems.length === 0}
                  onClick={handleWhatsAppSend}
                  style={{ width: '100%', marginTop: 'auto' }}
                >
                  <Phone size={18} />
                  Send Quote via WhatsApp
                </button>
              </div>
            </div>
          </section>
        )}

        {/* TAB 4: CREDIT ONBOARDING WIZARD */}
        {activeTab === 'credit' && (
          <section className="credit-section animate-slide-up">
            {/* Visual Back Navigation */}
            <button onClick={() => { window.location.hash = 'home'; }} className="btn-back-nav">
              <ArrowLeft size={16} style={{ marginRight: '6px' }} />
              Back to Home
            </button>

            <div className="section-header">
              <h2>Business Credit Limit Portal</h2>
              <p>Assess credit eligibility based on order values, complete digital KYC, and initiate onboarding.</p>
            </div>

            {/* Interactive Credit Calculator */}
            <div className="glass-card credit-calc-widget" style={{ marginBottom: '32px', textAlign: 'left' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '8px', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={18} /> Interactive Credit Limit Calculator
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                Adjust the purchase size slider and requested days to estimate your initial revolving credit line limit.
              </p>
              
              <div className="credit-sliders-grid">
                <div className="form-group">
                  <div className="slider-label-row">
                    <span className="form-label">Monthly Purchase Volume</span>
                    <strong style={{ color: 'white' }}>₹{(calcVolume / 100000).toFixed(1)} Lakhs</strong>
                  </div>
                  <input 
                    type="range" 
                    min="50000" 
                    max="1500000" 
                    step="50000" 
                    value={calcVolume} 
                    onChange={(e) => setCalcVolume(Number(e.target.value))}
                    className="custom-range-slider"
                  />
                  <div className="slider-limit-labels">
                    <span>₹50K</span>
                    <span>₹15L</span>
                  </div>
                </div>

                <div className="form-group">
                  <span className="form-label">Payment Repayment Cycle</span>
                  <div className="days-toggle-row">
                    {[15, 30, 45].map(days => (
                      <button
                        key={days}
                        type="button"
                        onClick={() => setCalcDays(days)}
                        className={`days-toggle-btn ${calcDays === days ? 'active' : ''}`}
                      >
                        {days} Days
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="credit-limit-output-box">
                <div className="output-column">
                  <span className="output-label">Estimated Credit Limit</span>
                  <h4 className="output-value">₹{Math.round(estimatedCreditLimit).toLocaleString('en-IN')}</h4>
                </div>
                <div className="output-badge-box">
                  <span className="badge badge-success">Pre-Approved</span>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>Pending document upload</span>
                </div>
              </div>
            </div>

            {/* Credit Form Wizard */}
            <div className="credit-box glass-card">
              {creditSubmitted ? (
                <div className="credit-success-card animate-fade-in">
                  <div className="credit-success-icon">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Onboarding Request Received</h3>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: '1.6' }}>
                    Thank you, <strong>{creditForm.contractorName}</strong>. Our B2B onboarding team will verify your business profile (<strong>{creditForm.businessName}</strong>) using PAN/GSTIN details and will contact you on <strong>{creditForm.phone}</strong> to activate your credit account.
                  </p>
                  
                  <div className="review-submitted-details">
                    <h4>Submitted Details Summary</h4>
                    <ul>
                      <li><span>GSTIN:</span> <span>{creditForm.gstin.toUpperCase() || 'Not Provided'}</span></li>
                      <li><span>PAN:</span> <span>{creditForm.pan.toUpperCase() || 'Not Provided'}</span></li>
                      <li><span>Terms:</span> <span>{creditForm.creditDays} cycle</span></li>
                      <li><span>Target limit:</span> <span>₹{Math.round(estimatedCreditLimit).toLocaleString('en-IN')}</span></li>
                    </ul>
                  </div>

                  <button className="btn btn-secondary" onClick={handleResetCredit}>
                    Submit a New Application
                  </button>
                </div>
              ) : (
                <form onSubmit={nextCreditStep}>
                  
                  {/* Step indicators */}
                  <div className="wizard-header">
                    <span style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Step {creditStep} of 3
                    </span>
                    <div className="wizard-steps">
                      <div className={`wizard-step-dot ${creditStep >= 1 ? 'active' : ''}`}></div>
                      <div className={`wizard-step-dot ${creditStep >= 2 ? 'active' : ''}`}></div>
                      <div className={`wizard-step-dot ${creditStep >= 3 ? 'active' : ''}`}></div>
                    </div>
                  </div>

                  <div className="wizard-progress-bar">
                    <div className="wizard-progress-fill" style={{ width: `${(creditStep / 3) * 100}%` }}></div>
                  </div>

                  {/* Wizard Forms */}
                  {creditStep === 1 && (
                    <div className="animate-fade-in">
                      <h3 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Business Details</h3>
                      
                      <div className="form-group">
                        <label className="form-label">Proprietor / Director Name</label>
                        <input 
                          type="text" 
                          name="contractorName"
                          required 
                          className="form-input" 
                          placeholder="e.g. Rajesh Sharma"
                          value={creditForm.contractorName}
                          onChange={handleCreditFieldChange}
                        />
                        {formErrors.contractorName && <span className="field-error-text">{formErrors.contractorName}</span>}
                      </div>

                      <div className="form-group">
                        <label className="form-label">Firm / Construction Company Name</label>
                        <input 
                          type="text" 
                          name="businessName"
                          required 
                          className="form-input" 
                          placeholder="e.g. Sharma Builders & Contractors"
                          value={creditForm.businessName}
                          onChange={handleCreditFieldChange}
                        />
                        {formErrors.businessName && <span className="field-error-text">{formErrors.businessName}</span>}
                      </div>

                      <div className="form-group">
                        <label className="form-label">GSTIN Number (Optional - for tax invoices)</label>
                        <input 
                          type="text" 
                          name="gstin"
                          className="form-input" 
                          placeholder="e.g. 07AAAAA1111A1Z1"
                          maxLength="15"
                          value={creditForm.gstin}
                          onChange={handleCreditFieldChange}
                        />
                        {formErrors.gstin && <span className="field-error-text">{formErrors.gstin}</span>}
                        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>Provide a valid 15-character GST registration key to claim input tax credits.</p>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Financial Ranges */}
                  {creditStep === 2 && (
                    <div className="animate-fade-in">
                      <h3 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Credit Ranges</h3>
                      
                      <div className="form-group">
                        <label className="form-label">Estimated Monthly Purchase Volume</label>
                        <select 
                          name="monthlyVolume"
                          className="form-select"
                          value={creditForm.monthlyVolume}
                          onChange={handleCreditFieldChange}
                        >
                          <option>Under ₹1 Lakh</option>
                          <option>₹1 Lakh - ₹5 Lakhs</option>
                          <option>₹5 Lakhs - ₹20 Lakhs</option>
                          <option>Above ₹20 Lakhs</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Requested Credit Days</label>
                        <select 
                          name="creditDays"
                          className="form-select"
                          value={creditForm.creditDays}
                          onChange={handleCreditFieldChange}
                        >
                          <option>15 Days</option>
                          <option>30 Days</option>
                          <option>45 Days</option>
                        </select>
                      </div>

                      <div className="discount-callout" style={{ margin: '8px 0 24px' }}>
                        <Info size={18} />
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}>
                          Revolving B2B credit accounts are reviewed periodically. Late payments will lead to limits reduction and credit blockages.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Contact Verification */}
                  {creditStep === 3 && (
                    <div className="animate-fade-in">
                      <h3 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Contact Verification</h3>
                      
                      <div className="form-group">
                        <label className="form-label">Company PAN Number (Optional)</label>
                        <input 
                          type="text" 
                          name="pan"
                          className="form-input" 
                          placeholder="e.g. ABCDE1234F"
                          maxLength="10"
                          value={creditForm.pan}
                          onChange={handleCreditFieldChange}
                        />
                        {formErrors.pan && <span className="field-error-text">{formErrors.pan}</span>}
                      </div>

                      <div className="form-group">
                        <label className="form-label">WhatsApp Contact Number</label>
                        <input 
                          type="tel" 
                          name="phone"
                          required 
                          pattern="[0-9]{10}"
                          className="form-input" 
                          placeholder="10-digit mobile number"
                          value={creditForm.phone}
                          onChange={handleCreditFieldChange}
                        />
                        {formErrors.phone && <span className="field-error-text">{formErrors.phone}</span>}
                      </div>

                      <div className="form-group" style={{ flexDirection: 'row', alignItems: 'flex-start', gap: '8px', marginTop: '16px' }}>
                        <input type="checkbox" required id="consent" style={{ marginTop: '4px', cursor: 'pointer' }} />
                        <label htmlFor="consent" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                          I agree to share the business details and authorize Apex Build Mart credit analysts to perform background and credit rating checks.
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px' }}>
                    {creditStep > 1 ? (
                      <button type="button" className="btn btn-secondary" onClick={prevCreditStep}>
                        Back
                      </button>
                    ) : (
                      <div></div>
                    )}
                    
                    <button type="submit" className="btn btn-primary">
                      {creditStep === 3 ? 'Submit Onboarding' : 'Next Step'}
                      <ChevronRight size={16} />
                    </button>
                  </div>

                </form>
              )}
            </div>
          </section>
        )}

        {/* Customer Social Proof Testimonials */}
        <section className="reviews-section">
          <div className="section-header">
            <h2>Trusted by Civil Developers</h2>
            <p>Read client reviews from civil construction contractors and builders in North India.</p>
          </div>

          <div className="reviews-grid">
            <div className="review-card glass-card">
              <div className="rating-stars">
                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
              </div>
              <p className="review-body">
                "For our construction projects in Noida, sourcing Astral CPVC pipes in bulk was always a pricing nightmare. Apex Build Mart digital bill estimator lets us calculate CGST/SGST immediately, and our WhatsApp order goes out in seconds. The 30-day credit has completely resolved our site cash flow constraints."
              </p>
              <div className="reviewer-info">
                <div className="reviewer-avatar">SK</div>
                <div className="reviewer-details">
                  <h4>S.K. Sharma</h4>
                  <p>Director, S.K. Builders & Developers (Noida)</p>
                </div>
              </div>
            </div>

            <div className="review-card glass-card">
              <div className="rating-stars">
                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
              </div>
              <p className="review-body">
                "We regular buy Bosch heavy machinery and fasteners from Apex. Having certified manufacturer warranties, transparent GST invoices, and structured credit approvals on a mobile interface makes procurement extremely easy for our site engineers. Highly recommended B2B vendor."
              </p>
              <div className="reviewer-info">
                <div className="reviewer-avatar">KF</div>
                <div className="reviewer-details">
                  <h4>Karthik Rao</h4>
                  <p>Procurement Lead, Karthik Infrastructures (Gurugram)</p>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Floating WhatsApp Action */}
      <a 
        href={`https://wa.me/919999999999?text=Hello%20Apex%20Build%20Mart%2C%20I%20want%20to%20inquire%20about%20wholesale%20rates.`} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="whatsapp-float"
        aria-label="Direct B2B inquiry on WhatsApp"
      >
        <Phone size={28} style={{ transform: 'rotate(90deg)' }} />
      </a>

      {/* Toast Notification */}
      <div className={`toast-notification ${toastVisible ? 'visible' : ''}`}>
        <Check size={16} className="toast-icon" />
        <span>{toastMessage}</span>
      </div>

      {/* Hero Video Expandable Modal Overlay */}
      {isHeroExpanded && (
        <div className="modal-overlay" onClick={() => setIsHeroExpanded(false)}>
          <div className="modal-video-card animate-zoom-in" onClick={(e) => e.stopPropagation()}>
            <div className="expanded-video-header">
              <h4>Apex Corporate Video Tour</h4>
              <button 
                className="btn-close-expanded" 
                onClick={() => setIsHeroExpanded(false)}
                aria-label="Close video player"
              >
                <X size={18} />
              </button>
            </div>
            <div className="video-iframe-wrapper">
              <iframe 
                src={YOUTUBE_EMBED} 
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowFullScreen
              ></iframe>
            </div>
            <div className="expanded-card-info">
              <p>This video demonstrates our NCR logistics warehousing hub and real-time site fulfillment process. We distribute Astral, Bosch, Tata, and Birla materials directly to commercial developers.</p>
              <a 
                href={YOUTUBE_URL} 
                target="_blank" 
                rel="noreferrer" 
                className="btn btn-secondary btn-sm"
                style={{ marginTop: '12px', display: 'inline-flex', padding: '6px 12px', fontSize: '0.85rem' }}
              >
                Open in YouTube
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Product Modal */}
      {activeProductModal && (
        <div className="modal-overlay" onClick={() => setActiveProductModal(null)}>
          <div className="modal-drawer-card animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-row">
              <span className="product-brand">{activeProductModal.brand}</span>
              <button 
                className="btn-modal-close"
                onClick={() => setActiveProductModal(null)}
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="modal-scroll-body">
              <div className="modal-product-layout">
                <div className="modal-img-col">
                  <img src={activeProductModal.image} alt={activeProductModal.name} className="modal-img" />
                </div>
                <div className="modal-details-col">
                  <h3 className="modal-product-title">{activeProductModal.name}</h3>
                  <p className="modal-product-specs">{activeProductModal.specs}</p>
                  
                  <div className="modal-stock-info">
                    <span className="badge badge-success">In Stock</span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>NCR Warehouse: {activeProductModal.stock}</span>
                  </div>

                  <div className="modal-spec-block">
                    <h4>Manufacturer Details & Description</h4>
                    <p>{activeProductModal.longSpecs}</p>
                  </div>

                  <div className="modal-pricing-matrix">
                    <h4>B2B Pricing Tiers</h4>
                    <div className="pricing-grid-block">
                      <div className="price-tier-row">
                        <span>Standard (1 - {activeProductModal.minBulkQty - 1} pcs)</span>
                        <strong>₹{activeProductModal.price} / pc</strong>
                      </div>
                      <div className="price-tier-row bulk-highlight">
                        <span>Wholesale ({activeProductModal.minBulkQty}+ pcs)</span>
                        <strong>₹{activeProductModal.bulkPrice} / pc</strong>
                      </div>
                    </div>
                  </div>

                  <div className="modal-actions-row" style={{ display: 'flex', gap: '12px' }}>
                    <button 
                      className="btn btn-secondary"
                      onClick={() => setActiveProductModal(null)}
                      style={{ flex: 1 }}
                    >
                      Back to Catalog
                    </button>
                    <button 
                      className="btn btn-primary"
                      onClick={() => {
                        addToQuote(activeProductModal, 1);
                        setActiveProductModal(null);
                      }}
                      style={{ flex: 1.5 }}
                    >
                      <ShoppingCart size={18} />
                      Add to Quotation
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Bottom Navigation Bar */}
      <nav className="mobile-nav-bar">
        <button 
          onClick={() => { window.location.hash = 'home'; }} 
          className={`mobile-nav-item ${activeTab === 'home' ? 'active' : ''}`}
        >
          <Building2 />
          <span>Home</span>
        </button>

        <button 
          onClick={() => { window.location.hash = 'catalog'; }} 
          className={`mobile-nav-item ${activeTab === 'catalog' ? 'active' : ''}`}
        >
          <Wrench />
          <span>Catalog</span>
        </button>

        <button 
          onClick={() => { window.location.hash = 'quote'; }} 
          className={`mobile-nav-item ${activeTab === 'quote' ? 'active' : ''}`}
        >
          <div style={{ position: 'relative' }}>
            <ShoppingCart />
            {quoteItems.length > 0 && (
              <span className="cart-badge-count animate-fade-in">
                {pricingSummary.totalQty}
              </span>
            )}
          </div>
          <span>Quote</span>
        </button>

        <button 
          onClick={() => { window.location.hash = 'credit'; }} 
          className={`mobile-nav-item ${activeTab === 'credit' ? 'active' : ''}`}
        >
          <CreditCard />
          <span>Credit</span>
        </button>
      </nav>

      {/* Desktop/Tablet Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-column">
              <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: '800' }}>APEX BUILD MART</h3>
              <p style={{ marginTop: '12px', fontSize: '0.85rem' }}>
                Simplifying construction supply chain in India. Technology-driven wholesale procurement for infrastructure companies, developers, and builders.
              </p>
              <p style={{ marginTop: '16px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                GSTIN: 09AAPCA1922K1Z4<br/>
                CIN: U45201DL2024PTC192833
              </p>
            </div>
            
            <div className="footer-column">
              <h3>Our Categories</h3>
              <div className="footer-links">
                <a href="#catalog" onClick={() => { window.location.hash = 'catalog'; setSelectedCategory('Plumbing'); }}>Astral CPVC Pipes & Fittings</a>
                <a href="#catalog" onClick={() => { window.location.hash = 'catalog'; setSelectedCategory('Tools'); }}>Bosch Industrial Power Tools</a>
                <a href="#catalog" onClick={() => { window.location.hash = 'catalog'; setSelectedCategory('Fasteners'); }}>Tata Tiscon TMT & Wire Nails</a>
                <a href="#catalog" onClick={() => { window.location.hash = 'catalog'; setSelectedCategory('Electrical'); }}>Finolex Copper Cables</a>
                <a href="#catalog" onClick={() => { window.location.hash = 'catalog'; setSelectedCategory('Paint & Putty'); }}>Birla Putty & Paints</a>
              </div>
            </div>

            <div className="footer-column">
              <h3>Office & Warehousing</h3>
              <p>
                <strong>Apex Build Mart India Pvt. Ltd.</strong><br/>
                Plot 148, Sector 63, Noida Industrial Area,<br/>
                Gautam Buddha Nagar, Uttar Pradesh - 201301<br/>
                <br/>
                <strong>Email:</strong> bulk@apexbuildmart.com<br/>
                <strong>Call:</strong> +91 9999999999
              </p>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} Apex Build Mart. All rights reserved.</p>
            <p>Designed for premium B2B construction partnerships in India.</p>
          </div>
        </div>
      </footer>
    </>
  );
}

export default App;
