import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  StyleSheet, 
  TextInput,
  ScrollView,
  Linking,
  StatusBar,
  ActivityIndicator,
  Dimensions,
  useWindowDimensions,
  Platform
} from 'react-native';

// Hook personnalisé pour la responsive design
const useResponsive = () => {
  const { width, height } = useWindowDimensions();
  
  const isSmallDevice = width < 375;
  const isMediumDevice = width >= 375 && width < 768;
  const isLargeDevice = width >= 768;
  const isTablet = width >= 768;
  const isLandscape = width > height;

  return {
    width,
    height,
    isSmallDevice,
    isMediumDevice,
    isLargeDevice,
    isTablet,
    isLandscape,
    fontSize: {
      xs: isSmallDevice ? 10 : isMediumDevice ? 12 : 14,
      sm: isSmallDevice ? 12 : isMediumDevice ? 14 : 16,
      base: isSmallDevice ? 14 : isMediumDevice ? 16 : 18,
      lg: isSmallDevice ? 16 : isMediumDevice ? 18 : 20,
      xl: isSmallDevice ? 18 : isMediumDevice ? 20 : 24,
      xxl: isSmallDevice ? 20 : isMediumDevice ? 24 : 28,
    },
    spacing: {
      xs: isSmallDevice ? 4 : isMediumDevice ? 6 : 8,
      sm: isSmallDevice ? 8 : isMediumDevice ? 12 : 16,
      base: isSmallDevice ? 12 : isMediumDevice ? 16 : 20,
      lg: isSmallDevice ? 16 : isMediumDevice ? 20 : 24,
      xl: isSmallDevice ? 20 : isMediumDevice ? 24 : 32,
    },
    imageSize: {
      product: isSmallDevice ? 80 : isMediumDevice ? 100 : 120,
      productLarge: isSmallDevice ? 200 : isMediumDevice ? 250 : 300,
      cart: isSmallDevice ? 60 : isMediumDevice ? 70 : 80,
    }
  };
};

// Génération de 100 catégories différentes
const categoriesList = [
  // Vêtements
  "Vêtements Homme", "Vêtements Femme", "Vêtements Enfant", "Vêtements Bébé",
  "Vêtements Sport", "Vêtements Traditionnels", "Sous-vêtements", "Pyjamas",
  "Maillots de Bain", "Vêtements Maternité", "Uniformmes Scolaires", "Costumes",
  
  // Chaussures
  "Chaussures Homme", "Chaussures Femme", "Chaussures Enfant", "Chaussures Sport",
  "Sandales", "Bottes", "Talons", "Baskets", "Mocassins", "Chaussures Maison",
  
  // Accessoires
  "Sacs à Main", "Sacs à Dos", "Portefeuilles", "Ceintures", "Bijoux", "Montres",
  "Lunettes de Soleil", "Chapeaux", "Écharpes", "Gants", "Accessoires Cheveux",
  
  // Électronique
  "Smartphones", "Tablettes", "Ordinateurs", "Télévisions", "Audio & Casques",
  "Caméras", "Jeux Vidéo", "Accessoires Gaming", "Câbles & Chargeurs", "Batteries",
  
  // Électroménager
  "Réfrigérateurs", "Fours & Cuisinières", "Lave-linge", "Lave-vaisselle", "Micro-ondes",
  "Mixeurs & Blenders", "Cafetières", "Aspirateurs", "Climatiseurs", "Ventilateurs",
  
  // Maison & Déco
  "Meubles Salon", "Meubles Chambre", "Meubles Bureau", "Meubles Jardin", "Literie",
  "Décoration Murale", "Luminaires", "Rideaux", "Tapis", "Coussins",
  
  // Beauté & Soins
  "Soins Visage", "Soins Corps", "Maquillage", "Parfums", "Soins Cheveux",
  "Hygiène Dentaire", "Rasage & Épilations", "Produits Homme", "Soins Bébé",
  
  // Santé & Bien-être
  "Compléments Alimentaires", "Soins Médicaux", "Appareils Médicaux", "Premiers Secours",
  "Soins Senior", "Matériel Médical", "Thermomètres", "Pèse-personnes",
  
  // Sport & Loisirs
  "Équipement Fitness", "Sports Collectifs", "Sports Raquette", "Sports Nautiques",
  "Cyclisme", "Randonnée", "Yoga & Pilates", "Camping", "Pêche", "Chasse",
  
  // Auto & Moto
  "Accessoires Auto", "Accessoires Moto", "Entretien Auto", "Pneus & Jantes",
  "Audio Auto", "Sécurité Routière", "GPS & Navigation", "Nettoyage Auto",
  
  // Bricolage & Jardin
  "Outils à Main", "Outils Électriques", "Quincaillerie", "Peinture & Revêtements",
  "Jardinage", "Éclairage Extérieur", "Barbecues", "Piscines & Spas",
  
  // Livres & Éducation
  "Livres Romans", "Livres Scolaires", "Livres Professionnels", "Livres Jeunesse",
  "Fournitures Bureau", "Papeterie", "Instruments Écriture", "Cartables",
  
  // Jouets & Enfants
  "Jouets Éducatifs", "Poupées & Figurines", "Jeux de Société", "Jouets Extérieur",
  "Vélos Enfants", "Déguisements", "Jeux Construction", "Peluches",
  
  // Animaux
  "Nourriture Chiens", "Nourriture Chats", "Accessoires Animaux", "Soins Animaux",
  "Jouets Animaux", "Transport Animaux", "Litières", "Aquariums",
  
  // Supermarché
  "Épicerie Sèche", "Produits Frais", "Surgelés", "Boissons", "Boulangerie",
  "Produits Laitiers", "Viandes & Poissons", "Fruits & Légumes", "Bio & Naturel"
];

// Génération de 900+ produits avec des images réelles
const generateProducts = () => {
  const products = [];
  let id = 1;
  
  // Prix de base par catégorie
  const basePrices = {
    "Vêtements": 15000, "Chaussures": 35000, "Accessoires": 25000,
    "Électronique": 120000, "Électroménager": 250000, "Maison": 45000,
    "Beauté": 18000, "Santé": 32000, "Sport": 55000, "Auto": 75000,
    "Bricolage": 28000, "Livres": 12000, "Jouets": 22000, "Animaux": 15000,
    "Supermarché": 8000
  };

  // Sous-catégories avec produits spécifiques
  const productTemplates = {
    // Vêtements Homme
    "Vêtements Homme": [
      { name: "T-shirt Basique", price: 12000, desc: "100% coton, coupe regular" },
      { name: "Chemise Formelle", price: 25000, desc: "Coton popeline, col classique" },
      { name: "Jean Slim Fit", price: 35000, desc: "Délavé moderne, coupe ajustée" },
      { name: "Polo Élégant", price: 18000, desc: "Coton piqué, col boutonné" },
      { name: "Veste Sport", price: 45000, desc: "Polyester, coupe décontractée" },
      { name: "Pantalon Chino", price: 28000, desc: "Twill de coton, coupe droite" },
      { name: "Short Bermuda", price: 22000, desc: "Coton, longueur genou" },
      { name: "Sweat-shirt Capuche", price: 32000, desc: "Molleton, poche kangourou" },
      { name: "Blazer Classique", price: 65000, desc: "Laine, coupe structurée" },
      { name: "Manteau Hiver", price: 85000, desc: "Imperméable, doublure chaude" }
    ],
    
    "Vêtements Femme": [
      { name: "Robe Midi Élégante", price: 28000, desc: "Imprimé floral, manches courtes" },
      { name: "Jupe Plissée", price: 22000, desc: "Tissu fluide, longueur genou" },
      { name: "Top Soie", price: 32000, desc: "Soie naturelle, coupe ajustée" },
      { name: "Blouse Professionnelle", price: 26000, desc: "Popeline, col chemisier" },
      { name: "Jean Skinny", price: 38000, desc: "Élasthanne, coupe slim" },
      { name: "Combinaison Pantalon", price: 42000, desc: "Coton, coupe élégante" },
      { name: "Cardigan Doux", price: 34000, desc: "Laine mérinos, boutonnage" },
      { name: "Ensemble Sport", price: 45000, desc: "Polyester, confort optimal" },
      { name: "Robe de Soirée", price: 75000, desc: "Satin, coupe glamour" },
      { name: "Manteau Trench", price: 68000, desc: "Coton imperméable, ceinture" }
    ],

    "Smartphones": [
      { name: "Smartphone Android 128GB", price: 350000, desc: "Écran 6.5\", triple caméra" },
      { name: "iPhone 128GB", price: 850000, desc: "iOS, écran Retina, Face ID" },
      { name: "Smartphone Gaming", price: 450000, desc: "Processeur gaming, 120Hz" },
      { name: "Smartphone Photo Pro", price: 520000, desc: "Quad caméra, zoom optique" },
      { name: "Smartphone Économique", price: 180000, desc: "Autonomie longue durée" }
    ],

    "Électroménager": [
      { name: "Réfrigérateur Congélateur", price: 450000, desc: "350L, classe A++" },
      { name: "Lave-linge 8kg", price: 320000, desc: "Eco Bubble, 15 programmes" },
      { name: "Four Multifonction", price: 280000, desc: "Pyrolyse, 65L" },
      { name: "Micro-ondes 25L", price: 120000, desc: "Grill, 800W" },
      { name: "Aspirateur Robot", price: 180000, desc: "Navigation intelligente" }
    ],

    "Meubles Salon": [
      { name: "Canapé 3 Places", price: 250000, desc: "Tissu résistant, assise confort" },
      { name: "Table Basse Verre", price: 85000, desc: "Verre trempé, structure métal" },
      { name: "Meuble TV Moderne", price: 120000, desc: "Bois MDF, rangements multiples" },
      { name: "Fauteuil Relax", price: 150000, desc: "Cuir synthétique, inclinaison" },
      { name: "Étagère Décorative", price: 65000, desc: "5 niveaux, design scandinave" }
    ],

    "Sports Collectifs": [
      { name: "Ballon Football Pro", price: 25000, desc: "Taille 5, cuir synthétique" },
      { name: "Ballon Basketball", price: 22000, desc: "Taille 7, grip optimal" },
      { name: "Ballon Volleyball", price: 18000, desc: "Taille 5, surface texturée" },
      { name: "Maillot Football", price: 15000, desc: "Polyester, ventilation" },
      { name: "Chaussures Football", price: 45000, desc: "Crampons moulés, légères" }
    ],

    "Soins Visage": [
      { name: "Crème Hydratante SPF", price: 18000, desc: "50ml, peaux sensibles" },
      { name: "Sérum Anti-âge", price: 32000, desc: "30ml, vitamine C" },
      { name: "Démaquillant Biphasé", price: 12000, desc: "200ml, yeux sensibles" },
      { name: "Masque Argile Purifiant", price: 15000, desc: "100ml, pores resserrés" },
      { name: "Gommage Doux", price: 14000, desc: "150ml, grains fins" }
    ],

    "Jouets Éducatifs": [
      { name: "Lego Éducatif", price: 28000, desc: "250 pièces, développement créatif" },
      { name: "Puzzle 500 Pièces", price: 15000, desc: "Motif éducatif, carton résistant" },
      { name: "Tablette Éducative", price: 32000, desc: "20 activités, français/anglais" },
      { name: "Kit Scientifique", price: 45000, desc: "50 expériences, manuel inclus" },
      { name: "Jeu de Construction", price: 38000, desc: "180 pièces, moteur électrique" }
    ]
  };

  // Génération des produits
  categoriesList.forEach(category => {
    const mainCategory = category.split(' ')[0];
    const basePrice = basePrices[mainCategory] || 25000;
    
    // Trouver le template ou générer aléatoirement
    let templateProducts = productTemplates[category];
    
    if (!templateProducts) {
      // Génération aléatoire pour les catégories sans template
      templateProducts = Array.from({ length: 8 }, (_, i) => {
        const adjectives = ["Premium", "Professionnel", "Élégant", "Confortable", "Durable", "Moderne", "Classique", "Innovant"];
        const types = ["Modèle Standard", "Édition Spéciale", "Version Pro", "Pack Complet", "Set Débutant"];
        
        return {
          name: `${category} ${adjectives[i]} ${types[i % types.length]}`,
          price: Math.floor(basePrice * (0.7 + Math.random() * 0.6)),
          desc: `Produit ${category.toLowerCase()} de haute qualité, design soigné et durable`
        };
      });
    }

    // Créer les produits pour cette catégorie
    templateProducts.forEach((template, index) => {
      products.push({
        id: id++,
        name: template.name,
        price: template.price,
        image: `https://picsum.photos/300/300?random=${id}&category=${encodeURIComponent(category)}`,
        description: template.desc,
        category: category,
        stock: Math.floor(Math.random() * 100) + 10,
        rating: (Math.random() * 2 + 3).toFixed(1), // 3.0 - 5.0
        reviews: Math.floor(Math.random() * 500)
      });
    });
  });

  // Ajouter plus de produits pour atteindre 900+
  const additionalProducts = 900 - products.length;
  for (let i = 0; i < additionalProducts; i++) {
    const category = categoriesList[Math.floor(Math.random() * categoriesList.length)];
    const mainCategory = category.split(' ')[0];
    const basePrice = basePrices[mainCategory] || 25000;
    
    const productTypes = {
      "Vêtements": ["T-shirt", "Chemise", "Pantalon", "Robe", "Veste", "Short", "Jupe"],
      "Chaussures": ["Baskets", "Sandales", "Talons", "Bottes", "Mocassins"],
      "Électronique": ["Smartphone", "Tablette", "Casque", "Enceinte", "Montre"],
      "Maison": ["Canapé", "Table", "Chaise", "Lampe", "Tapis", "Coussin"],
      "Sport": ["Ballon", "Raquette", "Tapis", "Haltères", "Corde"],
      "Beauté": ["Crème", "Sérum", "Masque", "Parfum", "Maquillage"]
    };
    
    const typeCategory = Object.keys(productTypes).find(key => category.includes(key)) || "Vêtements";
    const types = productTypes[typeCategory];
    const type = types[Math.floor(Math.random() * types.length)];
    
    const adjectives = ["Premium", "Luxe", "Élégant", "Confortable", "Professionnel", "Moderne"];
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    
    products.push({
      id: id++,
      name: `${type} ${adjective} ${category}`,
      price: Math.floor(basePrice * (0.6 + Math.random() * 0.8)),
      image: `https://picsum.photos/300/300?random=${id + 1000}`,
      description: `${type} de haute qualité pour ${category.toLowerCase()}, design soigné et durable pour un usage quotidien`,
      category: category,
      stock: Math.floor(Math.random() * 150) + 5,
      rating: (Math.random() * 2 + 3).toFixed(1),
      reviews: Math.floor(Math.random() * 300)
    });
  }

  return products;
};

const products = generateProducts();

// Composant Product Card Responsive
const ProductCard = ({ product, onPress, onAddToCart, responsive }) => {
  const { isSmallDevice, isTablet, fontSize, spacing, imageSize } = responsive;
  
  const columns = isTablet ? 3 : 2;
  const cardWidth = (responsive.width - spacing.base * (columns + 1)) / columns;

  return (
    <TouchableOpacity 
      style={[
        styles.productCard,
        {
          width: cardWidth,
          margin: spacing.xs,
          padding: spacing.sm,
          minHeight: isSmallDevice ? 220 : 260,
        }
      ]}
      onPress={onPress}
    >
      <Image 
        source={{ uri: product.image }} 
        style={[
          styles.productImage,
          {
            height: imageSize.product,
            marginBottom: spacing.sm,
          }
        ]} 
      />
      <View style={styles.productInfo}>
        <Text 
          style={[
            styles.productName,
            { fontSize: fontSize.sm, marginBottom: spacing.xs }
          ]} 
          numberOfLines={2}
        >
          {product.name}
        </Text>
        
        <View style={styles.ratingContainer}>
          <Text style={[styles.rating, { fontSize: fontSize.xs }]}>
            ⭐ {product.rating}
          </Text>
          <Text style={[styles.reviews, { fontSize: fontSize.xs }]}>
            ({product.reviews} avis)
          </Text>
        </View>
        
        <Text 
          style={[
            styles.productPrice,
            { fontSize: fontSize.base, marginBottom: spacing.xs }
          ]}
        >
          {product.price.toLocaleString()} FBU
        </Text>
        <Text 
          style={[
            styles.productStock,
            { fontSize: fontSize.xs, marginBottom: spacing.sm }
          ]}
        >
          📦 Stock: {product.stock}
        </Text>
        <TouchableOpacity 
          style={[
            styles.addButton,
            { paddingVertical: spacing.xs }
          ]}
          onPress={onAddToCart}
        >
          <Text 
            style={[
              styles.addButtonText,
              { fontSize: fontSize.xs }
            ]}
          >
            🛒 Ajouter
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

// Écran d'accueil avec 900+ produits
function HomeScreen({ navigation }) {
  const responsive = useResponsive();
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('name');
  const [priceRange, setPriceRange] = useState([0, 1000000]);

  const categories = ['Tous', ...categoriesList];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Tous' || product.category === selectedCategory;
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const renderProduct = ({ item }) => (
    <ProductCard 
      product={item}
      onPress={() => navigation.navigate('Product', { product: item })}
      onAddToCart={() => addToCart(item)}
      responsive={responsive}
    />
  );

  const numColumns = responsive.isTablet ? 3 : 2;

  return (
    <View style={styles.container}>
      {/* Header Responsive */}
      <View style={[
        styles.header,
        {
          paddingHorizontal: responsive.spacing.base,
          paddingVertical: responsive.spacing.sm,
        }
      ]}>
        <View>
          <Text style={[
            styles.title,
            { fontSize: responsive.fontSize.xxl }
          ]}>
            {responsive.isSmallDevice ? '🛍️' : '🛍️ MUCO SHOP'}
          </Text>
          <Text style={[
            styles.subtitle,
            { fontSize: responsive.fontSize.xs }
          ]}>
            900+ produits • 100 catégories
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.cartIcon}
          onPress={() => navigation.navigate('Cart', { cart })}
        >
          <Text style={[
            styles.cartIconText,
            { fontSize: responsive.fontSize.xl }
          ]}>
            🛒
          </Text>
          {cart.length > 0 && (
            <View style={[
              styles.cartBadge,
              {
                minWidth: responsive.isSmallDevice ? 16 : 20,
                height: responsive.isSmallDevice ? 16 : 20,
              }
            ]}>
              <Text style={[
                styles.cartBadgeText,
                { fontSize: responsive.fontSize.xs }
              ]}>
                {cart.length}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Search Bar Responsive */}
      <View style={[
        styles.searchContainer,
        {
          paddingHorizontal: responsive.spacing.base,
          paddingVertical: responsive.spacing.sm,
        }
      ]}>
        <TextInput
          style={[
            styles.searchInput,
            {
              paddingHorizontal: responsive.spacing.base,
              paddingVertical: responsive.spacing.sm,
              fontSize: responsive.fontSize.base,
            }
          ]}
          placeholder="🔍 Rechercher parmi 900+ produits..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Filtres Responsive */}
      <View style={[
        styles.filterContainer,
        {
          paddingHorizontal: responsive.spacing.base,
          paddingVertical: responsive.spacing.sm,
        }
      ]}>
        <Text style={[
          styles.filterLabel,
          { fontSize: responsive.fontSize.sm }
        ]}>
          Trier par:
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {[
            { key: 'name', label: 'Nom' },
            { key: 'price-asc', label: 'Prix croissant' },
            { key: 'price-desc', label: 'Prix décroissant' },
            { key: 'rating', label: 'Meilleures notes' }
          ].map((sort) => (
            <TouchableOpacity 
              key={sort.key}
              style={[
                styles.filterButton,
                sortBy === sort.key && styles.filterButtonActive,
                {
                  paddingHorizontal: responsive.spacing.base,
                  paddingVertical: responsive.spacing.xs,
                  marginRight: responsive.spacing.sm,
                }
              ]}
              onPress={() => setSortBy(sort.key)}
            >
              <Text style={[
                styles.filterButtonText,
                { fontSize: responsive.fontSize.xs },
                sortBy === sort.key && styles.filterButtonTextActive
              ]}>
                {sort.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Catégories Responsive */}
      <View style={[
        styles.categoriesSection,
        {
          paddingHorizontal: responsive.spacing.base,
        }
      ]}>
        <Text style={[
          styles.sectionTitle,
          { fontSize: responsive.fontSize.base, marginBottom: responsive.spacing.sm }
        ]}>
          📁 Catégories ({categories.length})
        </Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
        >
          {categories.map((category, index) => (
            <TouchableOpacity 
              key={index} 
              style={[
                styles.categoryChip,
                selectedCategory === category && styles.categoryChipActive,
                {
                  paddingHorizontal: responsive.spacing.base,
                  paddingVertical: responsive.spacing.xs,
                  marginRight: responsive.spacing.sm,
                }
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={[
                styles.categoryText,
                { fontSize: responsive.fontSize.xs },
                selectedCategory === category && styles.categoryTextActive
              ]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Résultats Responsive */}
      <View style={[
        styles.resultsContainer,
        {
          paddingHorizontal: responsive.spacing.base,
          paddingVertical: responsive.spacing.sm,
        }
      ]}>
        <Text style={[
          styles.resultsCount,
          { fontSize: responsive.fontSize.base }
        ]}>
          🎯 {sortedProducts.length} produit(s) sur {products.length}
        </Text>
        <Text style={[
          styles.resultsCategory,
          { fontSize: responsive.fontSize.sm }
        ]}>
          {selectedCategory !== 'Tous' && `Catégorie: ${selectedCategory}`}
        </Text>
      </View>

      {/* Liste des produits */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={[
            styles.loadingText,
            { fontSize: responsive.fontSize.base }
          ]}>
            Chargement des produits...
          </Text>
        </View>
      ) : (
        <FlatList
          data={sortedProducts}
          renderItem={renderProduct}
          keyExtractor={item => item.id.toString()}
          numColumns={numColumns}
          contentContainerStyle={[
            styles.productsGrid,
            {
              padding: responsive.spacing.sm,
            }
          ]}
          showsVerticalScrollIndicator={false}
          initialNumToRender={12}
          maxToRenderPerBatch={15}
          windowSize={7}
          key={numColumns}
          removeClippedSubviews={true}
        />
      )}
    </View>
  );
}

// Écran produit détaillé
function ProductScreen({ route, navigation }) {
  const responsive = useResponsive();
  const { product } = route.params;
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const productImages = [
    product.image,
    `https://picsum.photos/300/300?random=${product.id + 1000}`,
    `https://picsum.photos/300/300?random=${product.id + 2000}`,
    `https://picsum.photos/300/300?random=${product.id + 3000}`
  ];

  const sendWhatsAppOrder = () => {
    const total = product.price * quantity;
    const message = `Bonjour MUCO SHOP! 

🛍️ NOUVELLE COMMANDE

*${product.name}*
📦 Catégorie: ${product.category}
💰 Prix unitaire: ${product.price.toLocaleString()} FBU
🔢 Quantité: ${quantity}
💵 Total: ${total.toLocaleString()} FBU

📝 Description: ${product.description}
⭐ Note: ${product.rating}/5 (${product.reviews} avis)

📞 Merci de me contacter au +257 67 30 10 44 pour finaliser la commande.

📍 Informations de livraison à fournir...`;

    const url = `whatsapp://send?phone=+25767301044&text=${encodeURIComponent(message)}`;
    
    Linking.openURL(url).catch(() => {
      alert('WhatsApp n\'est pas installé sur votre appareil');
    });
  };

  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Galerie d'images */}
      <ScrollView 
        horizontal 
        pagingEnabled 
        showsHorizontalScrollIndicator={false}
        style={[
          styles.imageGallery,
          { height: responsive.isTablet ? 400 : 300 }
        ]}
      >
        {productImages.map((image, index) => (
          <Image 
            key={index}
            source={{ uri: image }} 
            style={[
              styles.productImageLarge,
              {
                width: responsive.width,
                height: responsive.isTablet ? 400 : 300,
              }
            ]} 
          />
        ))}
      </ScrollView>
      
      <View style={[
        styles.productDetails,
        {
          padding: responsive.spacing.base,
        }
      ]}>
        <Text style={[
          styles.productNameLarge,
          { fontSize: responsive.fontSize.xxl }
        ]}>
          {product.name}
        </Text>
        
        {/* Rating et Reviews */}
        <View style={styles.productMeta}>
          <View style={styles.ratingContainer}>
            <Text style={[
              styles.ratingLarge,
              { fontSize: responsive.fontSize.base }
            ]}>
              ⭐ {product.rating}/5
            </Text>
            <Text style={[
              styles.reviewsLarge,
              { fontSize: responsive.fontSize.sm }
            ]}>
              ({product.reviews} avis)
            </Text>
          </View>
          <View style={[
            styles.stockContainer,
            { padding: responsive.spacing.xs }
          ]}>
            <Text style={[
              styles.stockText,
              { fontSize: responsive.fontSize.sm }
            ]}>
              📦 {product.stock} en stock
            </Text>
          </View>
        </View>
        
        <Text style={[
          styles.productPriceLarge,
          { fontSize: responsive.fontSize.xl }
        ]}>
          {product.price.toLocaleString()} FBU
        </Text>
        
        {/* Catégorie */}
        <View style={[
          styles.categoryContainer,
          { 
            padding: responsive.spacing.xs,
            marginBottom: responsive.spacing.base
          }
        ]}>
          <Text style={[
            styles.category,
            { fontSize: responsive.fontSize.sm }
          ]}>
            📁 {product.category}
          </Text>
        </View>
        
        <Text style={[
          styles.descriptionTitle,
          { fontSize: responsive.fontSize.lg, marginBottom: responsive.spacing.sm }
        ]}>
          Description
        </Text>
        <Text style={[
          styles.description,
          { 
            fontSize: responsive.fontSize.base,
            lineHeight: responsive.fontSize.base * 1.5,
            marginBottom: responsive.spacing.lg
          }
        ]}>
          {product.description}
        </Text>

        {/* Quantité Responsive */}
        <View style={[
          styles.quantityContainer,
          {
            padding: responsive.spacing.base,
            marginBottom: responsive.spacing.lg,
          }
        ]}>
          <Text style={[
            styles.quantityLabel,
            { fontSize: responsive.fontSize.base, marginBottom: responsive.spacing.sm }
          ]}>
            Quantité:
          </Text>
          <View style={styles.quantityControls}>
            <TouchableOpacity 
              style={[
                styles.quantityButton,
                {
                  width: responsive.isSmallDevice ? 35 : 40,
                  height: responsive.isSmallDevice ? 35 : 40,
                }
              ]} 
              onPress={decreaseQuantity}
            >
              <Text style={[
                styles.quantityButtonText,
                { fontSize: responsive.fontSize.lg }
              ]}>
                -
              </Text>
            </TouchableOpacity>
            <Text style={[
              styles.quantityValue,
              { 
                fontSize: responsive.fontSize.lg,
                marginHorizontal: responsive.spacing.base
              }
            ]}>
              {quantity}
            </Text>
            <TouchableOpacity 
              style={[
                styles.quantityButton,
                {
                  width: responsive.isSmallDevice ? 35 : 40,
                  height: responsive.isSmallDevice ? 35 : 40,
                }
              ]} 
              onPress={increaseQuantity}
            >
              <Text style={[
                styles.quantityButtonText,
                { fontSize: responsive.fontSize.lg }
              ]}>
                +
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={[
            styles.quantityTotal,
            { 
              fontSize: responsive.fontSize.base,
              marginTop: responsive.spacing.sm
            }
          ]}>
            💵 Total: {(product.price * quantity).toLocaleString()} FBU
          </Text>
        </View>
        
        {/* Bouton WhatsApp Responsive */}
        <TouchableOpacity 
          style={[
            styles.whatsappButton,
            {
              paddingVertical: responsive.spacing.base,
              marginBottom: responsive.spacing.lg,
            }
          ]} 
          onPress={sendWhatsAppOrder}
        >
          <Text style={[
            styles.whatsappButtonText,
            { fontSize: responsive.fontSize.base }
          ]}>
            📱 Commander via WhatsApp
          </Text>
        </TouchableOpacity>
        
        {/* Features Responsive */}
        <View style={[
          styles.features,
          {
            padding: responsive.spacing.base,
          }
        ]}>
          <Text style={[
            styles.featuresTitle,
            { fontSize: responsive.fontSize.lg, marginBottom: responsive.spacing.base }
          ]}>
            ✅ Avantages
          </Text>
          {[
            { icon: '🚚', text: 'Livraison rapide', subText: '2-3 jours ouvrables' },
            { icon: '🔒', text: 'Paiement sécurisé', subText: 'À la livraison' },
            { icon: '💬', text: 'Support 24/7', subText: '+257 67 30 10 44' },
            { icon: '↩️', text: 'Retour facile', subText: 'Sous 14 jours' },
            { icon: '⭐', text: 'Produit qualité', subText: `${product.rating}/5 sur ${product.reviews} avis` }
          ].map((feature, index) => (
            <View key={index} style={[
              styles.feature,
              { marginBottom: responsive.spacing.base }
            ]}>
              <Text style={[
                styles.featureIcon,
                { fontSize: responsive.fontSize.xl, marginRight: responsive.spacing.sm }
              ]}>
                {feature.icon}
              </Text>
              <View style={{ flex: 1 }}>
                <Text style={[
                  styles.featureText,
                  { fontSize: responsive.fontSize.base }
                ]}>
                  {feature.text}
                </Text>
                <Text style={[
                  styles.featureSubText,
                  { fontSize: responsive.fontSize.sm }
                ]}>
                  {feature.subText}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

// Écran panier (reste similaire mais adapté pour 900+ produits)
function CartScreen({ route, navigation }) {
  const responsive = useResponsive();
  const { cart } = route.params || { cart: [] };
  const [quantities, setQuantities] = useState({});

  const updateQuantity = (productId, newQuantity) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: newQuantity
    }));
  };

  const removeFromCart = (productId) => {
    const newCart = cart.filter(item => item.id !== productId);
    navigation.setParams({ cart: newCart });
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const quantity = quantities[item.id] || 1;
      return total + (item.price * quantity);
    }, 0);
  };

  const sendWhatsAppOrder = () => {
    if (cart.length === 0) {
      alert('Votre panier est vide. Ajoutez des produits avant de commander.');
      return;
    }

    let message = `Bonjour MUCO SHOP! 

🛍️ COMMANDE MULTIPLE

Détails de ma commande:

`;
    
    cart.forEach((item, index) => {
      const quantity = quantities[item.id] || 1;
      const total = item.price * quantity;
      message += `*${index + 1}. ${item.name}*
📦 Catégorie: ${item.category}
💰 Prix unitaire: ${item.price.toLocaleString()} FBU
🔢 Quantité: ${quantity}
💵 Sous-total: ${total.toLocaleString()} FBU
⭐ Note: ${item.rating}/5

`;
    });
    
    message += `*💵 TOTAL GÉNÉRAL: ${calculateTotal().toLocaleString()} FBU*

📞 Merci de me contacter au +257 67 30 10 44 pour finaliser cette commande.

📍 Informations de livraison à fournir...`;

    const url = `whatsapp://send?phone=+25767301044&text=${encodeURIComponent(message)}`;
    
    Linking.openURL(url).catch(() => {
      alert('WhatsApp n\'est pas installé sur votre appareil');
    });
  };

  const renderCartItem = ({ item, index }) => {
    const quantity = quantities[item.id] || 1;
    const total = item.price * quantity;

    return (
      <View style={[
        styles.cartItem,
        {
          marginHorizontal: responsive.spacing.sm,
          marginVertical: responsive.spacing.xs,
          padding: responsive.spacing.base,
        }
      ]}>
        <Image 
          source={{ uri: item.image }} 
          style={[
            styles.cartItemImage,
            {
              width: responsive.imageSize.cart,
              height: responsive.imageSize.cart,
              marginRight: responsive.spacing.base,
            }
          ]} 
        />
        <View style={[styles.cartItemInfo, { flex: 1 }]}>
          <Text style={[
            styles.cartItemName,
            { fontSize: responsive.fontSize.base, marginBottom: responsive.spacing.xs }
          ]}>
            {item.name}
          </Text>
          <Text style={[
            styles.cartItemCategory,
            { fontSize: responsive.fontSize.xs, marginBottom: responsive.spacing.xs }
          ]}>
            📁 {item.category}
          </Text>
          <Text style={[
            styles.cartItemPrice,
            { fontSize: responsive.fontSize.base, marginBottom: responsive.spacing.sm }
          ]}>
            {item.price.toLocaleString()} FBU
          </Text>
          
          <View style={[styles.cartQuantityContainer, { marginBottom: responsive.spacing.sm }]}>
            <Text style={[
              styles.quantityLabel,
              { fontSize: responsive.fontSize.sm, marginRight: responsive.spacing.sm }
            ]}>
              Quantité:
            </Text>
            <View style={styles.cartQuantityControls}>
              <TouchableOpacity 
                style={[
                  styles.quantityButtonSmall,
                  {
                    width: responsive.isSmallDevice ? 25 : 30,
                    height: responsive.isSmallDevice ? 25 : 30,
                  }
                ]}
                onPress={() => updateQuantity(item.id, Math.max(1, quantity - 1))}
              >
                <Text style={[
                  styles.quantityButtonText,
                  { fontSize: responsive.fontSize.base }
                ]}>
                  -
                </Text>
              </TouchableOpacity>
              <Text style={[
                styles.quantityValueSmall,
                { 
                  fontSize: responsive.fontSize.base,
                  marginHorizontal: responsive.spacing.sm
                }
              ]}>
                {quantity}
              </Text>
              <TouchableOpacity 
                style={[
                  styles.quantityButtonSmall,
                  {
                    width: responsive.isSmallDevice ? 25 : 30,
                    height: responsive.isSmallDevice ? 25 : 30,
                  }
                ]}
                onPress={() => updateQuantity(item.id, quantity + 1)}
              >
                <Text style={[
                  styles.quantityButtonText,
                  { fontSize: responsive.fontSize.base }
                ]}>
                  +
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <Text style={[
            styles.cartItemTotal,
            { fontSize: responsive.fontSize.sm }
          ]}>
            💵 Sous-total: {total.toLocaleString()} FBU
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.removeButton}
          onPress={() => removeFromCart(item.id)}
        >
          <Text style={[
            styles.removeButtonText,
            { fontSize: responsive.fontSize.lg }
          ]}>
            ✕
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {cart.length === 0 ? (
        <View style={[
          styles.emptyCart,
          { padding: responsive.spacing.xl }
        ]}>
          <Text style={[
            styles.emptyCartIcon,
            { fontSize: responsive.isSmallDevice ? 60 : 80 }
          ]}>
            🛒
          </Text>
          <Text style={[
            styles.emptyCartText,
            { 
              fontSize: responsive.fontSize.xl,
              marginBottom: responsive.spacing.sm
            }
          ]}>
            Votre panier est vide
          </Text>
          <Text style={[
            styles.emptyCartSubText,
            { 
              fontSize: responsive.fontSize.base,
              marginBottom: responsive.spacing.lg,
              textAlign: 'center'
            }
          ]}>
            Parcourez nos 900+ produits et 100 catégories
          </Text>
          <TouchableOpacity 
            style={[
              styles.shopButton,
              {
                paddingHorizontal: responsive.spacing.lg,
                paddingVertical: responsive.spacing.base,
              }
            ]}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={[
              styles.shopButtonText,
              { fontSize: responsive.fontSize.base }
            ]}>
              🛍️ Découvrir 900+ produits
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View style={[
            styles.cartHeader,
            {
              paddingHorizontal: responsive.spacing.base,
              paddingVertical: responsive.spacing.sm,
            }
          ]}>
            <View>
              <Text style={[
                styles.cartTitle,
                { fontSize: responsive.fontSize.xl }
              ]}>
                Mon Panier
              </Text>
              <Text style={[
                styles.cartSubtitle,
                { fontSize: responsive.fontSize.sm }
              ]}>
                {cart.length} article(s) sélectionné(s)
              </Text>
            </View>
            <Text style={[
              styles.cartCount,
              { fontSize: responsive.fontSize.base }
            ]}>
              🛒 {cart.length}
            </Text>
          </View>

          <FlatList
            data={cart}
            renderItem={renderCartItem}
            keyExtractor={(item, index) => item.id.toString()}
            style={styles.cartList}
            showsVerticalScrollIndicator={false}
          />
          
          <View style={[
            styles.footer,
            {
              padding: responsive.spacing.base,
            }
          ]}>
            <View style={[
              styles.totalContainer,
              { marginBottom: responsive.spacing.base }
            ]}>
              <Text style={[
                styles.totalLabel,
                { fontSize: responsive.fontSize.lg }
              ]}>
                Total Général:
              </Text>
              <Text style={[
                styles.totalAmount,
                { fontSize: responsive.fontSize.xl }
              ]}>
                {calculateTotal().toLocaleString()} FBU
              </Text>
            </View>
            
            <TouchableOpacity 
              style={[
                styles.orderButton,
                {
                  paddingVertical: responsive.spacing.base,
                  marginBottom: responsive.spacing.sm,
                }
              ]}
              onPress={sendWhatsAppOrder}
            >
              <Text style={[
                styles.orderButtonText,
                { fontSize: responsive.fontSize.base }
              ]}>
                📱 Commander {cart.length} article(s)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.continueShopping,
                { paddingVertical: responsive.spacing.sm }
              ]}
              onPress={() => navigation.navigate('Home')}
            >
              <Text style={[
                styles.continueShoppingText,
                { fontSize: responsive.fontSize.base }
              ]}>
                ← Continuer mes achats (900+ produits)
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#ffffff',
          },
          headerTintColor: '#333333',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ title: `MUCO SHOP - 900+ Produits` }}
        />
        <Stack.Screen 
          name="Product" 
          component={ProductScreen}
          options={{ title: 'Détails Produit' }}
        />
        <Stack.Screen 
          name="Cart" 
          component={CartScreen}
          options={{ title: 'Mon Panier' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Styles (reste similaire mais avec quelques ajouts)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  title: {
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  subtitle: {
    color: '#6c757d',
  },
  // ... (tous les autres styles restent similaires mais étendus)
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  rating: {
    color: '#ffc107',
    fontWeight: '600',
  },
  reviews: {
    color: '#6c757d',
    marginLeft: 4,
  },
  productMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingLarge: {
    color: '#ffc107',
    fontWeight: 'bold',
  },
  reviewsLarge: {
    color: '#6c757d',
  },
  categoriesSection: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  sectionTitle: {
    fontWeight: '600',
    color: '#2c3e50',
  },
  resultsContainer: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  resultsCategory: {
    color: '#007bff',
  },
  imageGallery: {
    backgroundColor: '#ffffff',
  },
  // ... autres styles
});

// Ajout des styles manquants pour compléter
Object.assign(styles, {
  cartIcon: {
    padding: 8,
    position: 'relative',
  },
  cartIconText: {
    fontWeight: 'bold',
  },
  cartBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#e74c3c',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: 'white',
    fontWeight: 'bold',
  },
  searchContainer: {
    backgroundColor: '#ffffff',
  },
  searchInput: {
    backgroundColor: '#f8f9fa',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  filterContainer: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  filterLabel: {
    fontWeight: '600',
    color: '#6c757d',
    marginBottom: 8,
  },
  filterButton: {
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  filterButtonActive: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  filterButtonText: {
    fontWeight: '500',
    color: '#495057',
  },
  filterButtonTextActive: {
    color: '#ffffff',
  },
  categoriesContainer: {
    paddingBottom: 8,
  },
  categoryChip: {
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  categoryChipActive: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  categoryText: {
    fontWeight: '500',
    color: '#495057',
  },
  categoryTextActive: {
    color: '#ffffff',
  },
  resultsCount: {
    fontWeight: '600',
    color: '#2c3e50',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#6c757d',
  },
  productsGrid: {
    backgroundColor: '#f8f9fa',
  },
  productCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: '100%',
    borderRadius: 8,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontWeight: '600',
    color: '#2c3e50',
  },
  productPrice: {
    fontWeight: 'bold',
    color: '#007bff',
  },
  productStock: {
    color: '#28a745',
  },
  addButton: {
    backgroundColor: '#28a745',
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 'auto',
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  productImageLarge: {
    backgroundColor: '#ffffff',
  },
  productDetails: {
    backgroundColor: 'white',
  },
  productNameLarge: {
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  productPriceLarge: {
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 16,
  },
  categoryContainer: {
    backgroundColor: '#e3f2fd',
    borderRadius: 15,
    alignSelf: 'flex-start',
  },
  stockContainer: {
    backgroundColor: '#e8f5e8',
    borderRadius: 15,
  },
  category: {
    color: '#1976d2',
    fontWeight: '500',
  },
  stockText: {
    color: '#2e7d32',
    fontWeight: '500',
  },
  descriptionTitle: {
    fontWeight: '600',
    color: '#2c3e50',
  },
  description: {
    color: '#6c757d',
  },
  quantityContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
  },
  quantityLabel: {
    fontWeight: '600',
    color: '#2c3e50',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quantityButton: {
    backgroundColor: '#007bff',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  quantityValue: {
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
  },
  quantityTotal: {
    fontWeight: 'bold',
    color: '#007bff',
    textAlign: 'center',
  },
  whatsappButton: {
    backgroundColor: '#25D366',
    borderRadius: 12,
    alignItems: 'center',
  },
  whatsappButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  features: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  featuresTitle: {
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureIcon: {
    fontWeight: 'bold',
  },
  featureText: {
    fontWeight: '600',
    color: '#2c3e50',
  },
  featureSubText: {
    color: '#6c757d',
  },
  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCartIcon: {
    marginBottom: 20,
  },
  emptyCartText: {
    fontWeight: 'bold',
    color: '#6c757d',
    textAlign: 'center',
  },
  emptyCartSubText: {
    color: '#adb5bd',
    textAlign: 'center',
    lineHeight: 22,
  },
  shopButton: {
    backgroundColor: '#007bff',
    borderRadius: 12,
  },
  shopButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  cartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  cartTitle: {
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  cartSubtitle: {
    color: '#6c757d',
  },
  cartCount: {
    color: '#007bff',
    fontWeight: 'bold',
  },
  cartList: {
    flex: 1,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  cartItemImage: {
    borderRadius: 8,
  },
  cartItemInfo: {
    flex: 1,
  },
  cartItemName: {
    fontWeight: '600',
    color: '#2c3e50',
  },
  cartItemCategory: {
    color: '#6c757d',
  },
  cartItemPrice: {
    fontWeight: 'bold',
    color: '#007bff',
  },
  cartQuantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartQuantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButtonSmall: {
    backgroundColor: '#007bff',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityValueSmall: {
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
  },
  cartItemTotal: {
    fontWeight: '600',
    color: '#28a745',
  },
  removeButton: {
    padding: 4,
  },
  removeButtonText: {
    color: '#dc3545',
    fontWeight: 'bold',
  },
  footer: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalLabel: {
    fontWeight: '600',
    color: '#2c3e50',
  },
  totalAmount: {
    fontWeight: 'bold',
    color: '#007bff',
  },
  orderButton: {
    backgroundColor: '#25D366',
    borderRadius: 12,
    alignItems: 'center',
  },
  orderButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  continueShopping: {
    alignItems: 'center',
  },
  continueShoppingText: {
    color: '#007bff',
    fontWeight: '500',
  },
});
