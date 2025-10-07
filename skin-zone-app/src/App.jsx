import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { 
  Search, 
  ShoppingCart, 
  User, 
  Heart, 
  Star, 
  TrendingUp, 
  Zap, 
  Brain, 
  Network,
  Beaker,
  Sparkles,
  MapPin,
  Calendar,
  DollarSign,
  Package
} from 'lucide-react'
import './App.css'

// Cognitive Synergy Components
const CognitiveDashboard = () => {
  const [synergyMetrics, setSynergyMetrics] = useState({
    networkStrength: 87,
    adaptiveCapacity: 92,
    emergentIntelligence: 78,
    systemCoherence: 85
  })

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Network className="h-4 w-4 text-purple-600" />
              Network Strength
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700">{synergyMetrics.networkStrength}%</div>
            <p className="text-xs text-purple-600 mt-1">Supplier-Salon Connectivity</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Zap className="h-4 w-4 text-green-600" />
              Adaptive Capacity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">{synergyMetrics.adaptiveCapacity}%</div>
            <p className="text-xs text-green-600 mt-1">Market Responsiveness</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Brain className="h-4 w-4 text-orange-600" />
              Emergent Intelligence
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-700">{synergyMetrics.emergentIntelligence}%</div>
            <p className="text-xs text-orange-600 mt-1">Collective Learning</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-blue-600" />
              System Coherence
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">{synergyMetrics.systemCoherence}%</div>
            <p className="text-xs text-blue-600 mt-1">Unified Operations</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            Cognitive Architecture Overview
          </CardTitle>
          <CardDescription>
            Real-time visualization of the Skin Zone cognitive ecosystem
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-sm">Deep Tree Echo (Right Hemisphere)</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Novelty Detection</span>
                  <Badge variant="secondary">Active</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Prime Pattern Recognition</span>
                  <Badge variant="secondary">Learning</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Simplex Processing</span>
                  <Badge variant="outline">Optimizing</Badge>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-sm">Marduk (Left Hemisphere)</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Metric Tensor Analysis</span>
                  <Badge variant="secondary">Active</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Categorical Logic</span>
                  <Badge variant="secondary">Processing</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Production Blueprints</span>
                  <Badge variant="outline">Generating</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Ingredient Marketplace Component
const IngredientMarketplace = () => {
  const [ingredients, setIngredients] = useState([
    {
      id: 1,
      name: "Hyaluronic Acid",
      supplier: "BioActive Solutions",
      price: "$45.99",
      pricePerKg: "$459.90",
      availability: "In Stock",
      purity: "99.5%",
      rating: 4.8,
      category: "Humectant",
      description: "High molecular weight hyaluronic acid for superior moisture retention"
    },
    {
      id: 2,
      name: "Vitamin C (L-Ascorbic Acid)",
      supplier: "Pure Cosmetics Supply",
      price: "$32.50",
      pricePerKg: "$325.00",
      availability: "Limited Stock",
      purity: "99.9%",
      rating: 4.9,
      category: "Antioxidant",
      description: "Pharmaceutical grade vitamin C for brightening and anti-aging formulations"
    },
    {
      id: 3,
      name: "Retinol Palmitate",
      supplier: "Advanced Actives Co.",
      price: "$78.25",
      pricePerKg: "$782.50",
      availability: "In Stock",
      purity: "98.8%",
      rating: 4.7,
      category: "Anti-aging",
      description: "Stable retinol derivative for gentle yet effective skin renewal"
    },
    {
      id: 4,
      name: "Niacinamide",
      supplier: "Derma Ingredients Ltd",
      price: "$28.75",
      pricePerKg: "$287.50",
      availability: "In Stock",
      purity: "99.7%",
      rating: 4.6,
      category: "Vitamin",
      description: "Multi-functional vitamin B3 for pore refinement and oil control"
    }
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const filteredIngredients = ingredients.filter(ingredient => 
    ingredient.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory === "all" || ingredient.category.toLowerCase() === selectedCategory.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search ingredients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select 
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Categories</option>
          <option value="humectant">Humectant</option>
          <option value="antioxidant">Antioxidant</option>
          <option value="anti-aging">Anti-aging</option>
          <option value="vitamin">Vitamin</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredIngredients.map((ingredient) => (
          <Card key={ingredient.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{ingredient.name}</CardTitle>
                  <CardDescription>{ingredient.supplier}</CardDescription>
                </div>
                <Badge variant={ingredient.availability === "In Stock" ? "default" : "secondary"}>
                  {ingredient.availability}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">{ingredient.description}</p>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Price (100g):</span>
                  <div className="text-lg font-bold text-green-600">{ingredient.price}</div>
                </div>
                <div>
                  <span className="font-medium">Per kg:</span>
                  <div className="text-sm text-gray-600">{ingredient.pricePerKg}</div>
                </div>
              </div>

              <div className="flex justify-between items-center text-sm">
                <div>
                  <span className="font-medium">Purity: </span>
                  <span className="text-blue-600">{ingredient.purity}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{ingredient.rating}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button size="sm" className="flex-1">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
                <Button size="sm" variant="outline">
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

// Salon & Spa Directory Component
const SalonDirectory = () => {
  const [salons, setSalons] = useState([
    {
      id: 1,
      name: "Luxe Skin Studio",
      location: "Beverly Hills, CA",
      rating: 4.9,
      services: ["Facials", "Chemical Peels", "Microdermabrasion"],
      priceRange: "$$$",
      availability: "Available Today",
      specialties: ["Anti-aging", "Acne Treatment"],
      image: "/api/placeholder/300/200"
    },
    {
      id: 2,
      name: "Zen Wellness Spa",
      location: "Manhattan, NY",
      rating: 4.7,
      services: ["Organic Facials", "LED Therapy", "Aromatherapy"],
      priceRange: "$$",
      availability: "Book Ahead",
      specialties: ["Sensitive Skin", "Natural Treatments"],
      image: "/api/placeholder/300/200"
    },
    {
      id: 3,
      name: "Advanced Derma Clinic",
      location: "Miami, FL",
      rating: 4.8,
      services: ["Medical Facials", "Laser Treatments", "Injectables"],
      priceRange: "$$$$",
      availability: "Limited Slots",
      specialties: ["Medical Grade", "Advanced Technology"],
      image: "/api/placeholder/300/200"
    }
  ])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {salons.map((salon) => (
          <Card key={salon.id} className="hover:shadow-lg transition-shadow">
            <div className="aspect-video bg-gradient-to-br from-pink-100 to-purple-100 rounded-t-lg flex items-center justify-center">
              <Sparkles className="h-12 w-12 text-purple-400" />
            </div>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{salon.name}</CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {salon.location}
                  </CardDescription>
                </div>
                <Badge variant={salon.availability === "Available Today" ? "default" : "secondary"}>
                  {salon.availability}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{salon.rating}</span>
                </div>
                <span className="text-sm font-medium text-green-600">{salon.priceRange}</span>
              </div>

              <div>
                <h4 className="font-medium text-sm mb-2">Services</h4>
                <div className="flex flex-wrap gap-1">
                  {salon.services.map((service, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {service}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-sm mb-2">Specialties</h4>
                <div className="flex flex-wrap gap-1">
                  {salon.specialties.map((specialty, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button size="sm" className="flex-1">
                  <Calendar className="h-4 w-4 mr-2" />
                  Book Now
                </Button>
                <Button size="sm" variant="outline">
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

// Main Navigation Component
const Navigation = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Skin Zone
            </h1>
          </div>
          
          <div className="flex items-center gap-6">
            <Button variant="ghost" size="sm">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
            <Button variant="ghost" size="sm">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Cart
            </Button>
            <Button variant="ghost" size="sm">
              <User className="h-4 w-4 mr-2" />
              Account
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}

function App() {
  const [activeTab, setActiveTab] = useState("marketplace")

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="marketplace" className="flex items-center gap-2">
              <Beaker className="h-4 w-4" />
              Ingredients
            </TabsTrigger>
            <TabsTrigger value="salons" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Salons & Spas
            </TabsTrigger>
            <TabsTrigger value="cognitive" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Cognitive Synergy
            </TabsTrigger>
          </TabsList>

          <TabsContent value="marketplace" className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold">Ingredient Marketplace</h2>
              <p className="text-gray-600">Discover premium skincare ingredients from verified suppliers</p>
            </div>
            <IngredientMarketplace />
          </TabsContent>

          <TabsContent value="salons" className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold">Salons & Spas Directory</h2>
              <p className="text-gray-600">Find and book treatments at premium skincare facilities</p>
            </div>
            <SalonDirectory />
          </TabsContent>

          <TabsContent value="cognitive" className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold">Cognitive Synergy Dashboard</h2>
              <p className="text-gray-600">Monitor the collective intelligence of the Skin Zone ecosystem</p>
            </div>
            <CognitiveDashboard />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

export default App
