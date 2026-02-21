'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Target, DollarSign, Globe, Clock, Users, Lightbulb, ArrowLeft } from 'lucide-react'

export default function CampaignSetupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    campaignName: '',
    budget: '',
    productDescription: '',
    targetAudience: '',
    region: '',
    campaignDuration: '',
    usp: '',
    demographics: '',
    companyName: '',
    industry: '',
    impressions: '',
    clicks: '',
    conversions: '',
    // Budget allocation
    budgetAllocation: {
      instagram: '',
      linkedin: '',
      facebook: '',
      google: '',
      twitter: '',
      youtube: '',
      tiktok: '',
      other: ''
    }
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleBudgetAllocationChange = (platform: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      budgetAllocation: {
        ...prev.budgetAllocation,
        [platform]: value
      }
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Save form data to localStorage
    localStorage.setItem('spendr_campaign_data', JSON.stringify(formData))
    
    // Create a new project and save it
    const newProject = {
      id: Date.now().toString(),
      name: formData.campaignName || 'New Campaign',
      company: formData.companyName,
      industry: formData.industry,
      budget: parseFloat(formData.budget),
      status: 'draft' as const,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      metrics: {
        impressions: formData.impressions ? parseInt(formData.impressions) : 0,
        clicks: formData.clicks ? parseInt(formData.clicks) : 0,
        conversions: formData.conversions ? parseInt(formData.conversions) : 0,
        roas: 0
      },
      data: formData
    }
    
    // Get existing projects
    const existingProjects = JSON.parse(localStorage.getItem('spendr_projects') || '[]')
    const updatedProjects = [...existingProjects, newProject]
    localStorage.setItem('spendr_projects', JSON.stringify(updatedProjects))
    
    // Navigate to dashboard
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 pt-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Campaign Setup
            </h1>
            <p className="text-xl text-gray-600">
              Provide your campaign details for comprehensive analysis
            </p>
          </div>
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Campaign Details</CardTitle>
            <CardDescription className="text-center">
              Fill in your campaign information to get started with analysis and optimization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Company Name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Company Name
                  </label>
                  <Input
                    placeholder="Enter your company name"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    required
                  />
                </div>

                {/* Industry */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Industry</label>
                  <Select value={formData.industry} onValueChange={(value) => handleInputChange('industry', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="real-estate">Real Estate</SelectItem>
                      <SelectItem value="food-beverage">Food & Beverage</SelectItem>
                      <SelectItem value="automotive">Automotive</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Budget */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Campaign Budget ($)
                  </label>
                  <Input
                    type="number"
                    placeholder="Enter your budget"
                    value={formData.budget}
                    onChange={(e) => handleInputChange('budget', e.target.value)}
                    required
                  />
                </div>

                {/* Campaign Duration */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Campaign Duration
                  </label>
                  <Select value={formData.campaignDuration} onValueChange={(value) => handleInputChange('campaignDuration', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-week">1 Week</SelectItem>
                      <SelectItem value="2-weeks">2 Weeks</SelectItem>
                      <SelectItem value="1-month">1 Month</SelectItem>
                      <SelectItem value="2-months">2 Months</SelectItem>
                      <SelectItem value="3-months">3 Months</SelectItem>
                      <SelectItem value="6-months">6 Months</SelectItem>
                      <SelectItem value="1-year">1 Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Target Region */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Target Region
                  </label>
                  <Select value={formData.region} onValueChange={(value) => handleInputChange('region', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select target region" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="north-america">North America</SelectItem>
                      <SelectItem value="europe">Europe</SelectItem>
                      <SelectItem value="asia-pacific">Asia Pacific</SelectItem>
                      <SelectItem value="latin-america">Latin America</SelectItem>
                      <SelectItem value="middle-east-africa">Middle East & Africa</SelectItem>
                      <SelectItem value="global">Global</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Target Audience */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Target Audience
                  </label>
                  <Input
                    placeholder="e.g., Young professionals, 25-35"
                    value={formData.targetAudience}
                    onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Product Description */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Product/Service Description</label>
                <Textarea
                  placeholder="Describe your product or service in detail..."
                  value={formData.productDescription}
                  onChange={(e) => handleInputChange('productDescription', e.target.value)}
                  className="min-h-[100px]"
                  required
                />
              </div>

              {/* USP */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" />
                  Unique Selling Proposition (USP)
                </label>
                <Textarea
                  placeholder="What makes your product/service unique?"
                  value={formData.usp}
                  onChange={(e) => handleInputChange('usp', e.target.value)}
                  className="min-h-[80px]"
                  required
                />
              </div>

              {/* Demographics */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Demographics</label>
                <Textarea
                  placeholder="Age range, gender, income level, interests, etc."
                  value={formData.demographics}
                  onChange={(e) => handleInputChange('demographics', e.target.value)}
                  className="min-h-[80px]"
                  required
                />
              </div>

              {/* Performance Metrics */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Current Campaign Performance</h3>
                <p className="text-sm text-gray-600">Enter your current campaign metrics (if available)</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Impressions</label>
                    <Input
                      type="number"
                      placeholder="e.g., 100000"
                      value={formData.impressions}
                      onChange={(e) => handleInputChange('impressions', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Clicks</label>
                    <Input
                      type="number"
                      placeholder="e.g., 2500"
                      value={formData.clicks}
                      onChange={(e) => handleInputChange('clicks', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Conversions</label>
                    <Input
                      type="number"
                      placeholder="e.g., 125"
                      value={formData.conversions}
                      onChange={(e) => handleInputChange('conversions', e.target.value)}
                    />
                  </div>
                </div>
              </div>


              {/* Budget Allocation */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Current Budget Allocation (%)</h3>
                <p className="text-sm text-gray-600">How do you currently distribute your marketing budget across platforms?</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Instagram</label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={formData.budgetAllocation.instagram}
                      onChange={(e) => handleBudgetAllocationChange('instagram', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">LinkedIn</label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={formData.budgetAllocation.linkedin}
                      onChange={(e) => handleBudgetAllocationChange('linkedin', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Facebook</label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={formData.budgetAllocation.facebook}
                      onChange={(e) => handleBudgetAllocationChange('facebook', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Google</label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={formData.budgetAllocation.google}
                      onChange={(e) => handleBudgetAllocationChange('google', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Twitter</label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={formData.budgetAllocation.twitter}
                      onChange={(e) => handleBudgetAllocationChange('twitter', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">YouTube</label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={formData.budgetAllocation.youtube}
                      onChange={(e) => handleBudgetAllocationChange('youtube', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">TikTok</label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={formData.budgetAllocation.tiktok}
                      onChange={(e) => handleBudgetAllocationChange('tiktok', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Other</label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={formData.budgetAllocation.other}
                      onChange={(e) => handleBudgetAllocationChange('other', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-center pt-6">
                <Button type="submit" size="lg" className="px-12">
                  Generate Campaign Analysis
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
