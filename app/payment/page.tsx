'use client'
export const dynamic = 'force-dynamic'

import React, { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { 
  Check, 
  CreditCard, 
  Lock, 
  Shield, 
  ArrowLeft,
  Loader2,
  CheckCircle,
  Star,
  Zap,
  Crown
} from 'lucide-react'

/* ---------- tiers / plans (unchanged) ---------- */
const tiers = [
  {
    name: "Playground",
    price: "Free",
    priceValue: 0,
    description: "Perfect for solo founders and hobbyists",
    icon: <Star className="w-6 h-6" />,
    variant: "success" as const,
    popular: false,
    features: [
      "1 campaign simulation per month",
      "Basic ROI dashboard",
      "No optimizer",
      "Community support",
    ],
    buttonText: "Get Started Free",
    buttonVariant: "success" as const,
  },
  {
    name: "Kickstarter",
    price: "₹2,999",
    priceValue: 2999,
    description: "Ideal for small teams and growing startups",
    icon: <Zap className="w-6 h-6" />,
    variant: "primary" as const,
    popular: true,
    features: [
      "Unlimited simulations",
      "Budget optimizer unlocked",
      "All industries available",
      "Export reports (PDF/CSV)",
      "Priority support",
    ],
    buttonText: "Start Pro Trial",
    buttonVariant: "primary" as const,
  },
  {
    name: "Overdrive",
    price: "₹17,999",
    priceValue: 17999,
    description: "Enterprise solution for agencies and large teams",
    icon: <Crown className="w-6 h-6" />,
    variant: "premium" as const,
    popular: false,
    features: [
      "Unlimited simulations + API access",
      "HubSpot, Salesforce, Google Ads integration",
      "White-label reports with agency branding",
      "Team collaboration (up to 10 users)",
      "Custom benchmarks upload",
      "Enterprise AI optimizer (multi-campaign)",
      "Dedicated manager + SLA-backed support",
    ],
    buttonText: "Contact Sales",
    buttonVariant: "premium" as const,
  },
];

const plans = {
  playground: tiers[0],
  kickstarter: tiers[1],
  overdrive: tiers[2]
}

/* ---------- Inner client component that uses useSearchParams ---------- */
function PaymentClientInner() {
  // Now it's safe to call useSearchParams() because this component
  // will be rendered inside a Suspense boundary.
  const router = useRouter()
  const searchParams = useSearchParams()
  const planType = (searchParams.get('plan') as keyof typeof plans) || 'kickstarter'
  const plan = plans[planType]

  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    name: '',
    email: '',
    address: '',
    city: '',
    zipCode: '',
    country: 'US'
  })

  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = matches && matches[0] || ''
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(' ')
    } else {
      return v
    }
  }

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\D/g, '')
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4)
    }
    return v
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.cardNumber || formData.cardNumber.replace(/\s/g, '').length < 16) {
      newErrors.cardNumber = 'Please enter a valid card number'
    }

    if (!formData.expiryDate || !/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
      newErrors.expiryDate = 'Please enter a valid expiry date (MM/YY)'
    }

    if (!formData.cvv || formData.cvv.length < 3) {
      newErrors.cvv = 'Please enter a valid CVV'
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Please enter your name'
    }

    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Please enter your address'
    }

    if (!formData.city.trim()) {
      newErrors.city = 'Please enter your city'
    }

    if (!formData.zipCode.trim()) {
      newErrors.zipCode = 'Please enter your zip code'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Handle free plan
    if (plan.priceValue === 0) {
      setIsSuccess(true)
      setTimeout(() => {
        router.push('/')
      }, 2000)
      return
    }
    
    if (!validateForm()) {
      return
    }

    setIsProcessing(true)

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000))

    setIsProcessing(false)
    setIsSuccess(true)

    // Redirect to dashboard after success
    setTimeout(() => {
      router.push('/')
    }, 2000)
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-6">
              Welcome to $pendr {plan.name}! You can now start optimizing your campaigns.
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <p>Redirecting to your dashboard...</p>
              <div className="flex justify-center">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 -ml-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Form - Only show for paid plans */}
          {plan.priceValue > 0 && (
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Information
                </CardTitle>
                <CardDescription>
                  Complete your subscription to $pendr {plan.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Card Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Card Details</h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={formData.cardNumber}
                        onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
                        className={errors.cardNumber ? 'border-red-500' : ''} 
                      />
                      {errors.cardNumber && (
                        <p className="text-sm text-red-600">{errors.cardNumber}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiryDate">Expiry Date</Label>
                        <Input
                          id="expiryDate"
                          placeholder="MM/YY"
                          value={formData.expiryDate}
                          onChange={(e) => handleInputChange('expiryDate', formatExpiryDate(e.target.value))}
                          className={errors.expiryDate ? 'border-red-500' : ''}
                        />
                        {errors.expiryDate && (
                          <p className="text-sm text-red-600">{errors.expiryDate}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          value={formData.cvv}
                          onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, '').slice(0, 4))}
                          className={errors.cvv ? 'border-red-500' : ''}
                        />
                        {errors.cvv && (
                          <p className="text-sm text-red-600">{errors.cvv}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Billing Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Billing Information</h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className={errors.name ? 'border-red-500' : ''}
                      />
                      {errors.name && (
                        <p className="text-sm text-red-600">{errors.name}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={errors.email ? 'border-red-500' : ''}
                      />
                      {errors.email && (
                        <p className="text-sm text-red-600">{errors.email}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        placeholder="123 Main St"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        className={errors.address ? 'border-red-500' : ''}
                      />
                      {errors.address && (
                        <p className="text-sm text-red-600">{errors.address}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          placeholder="New York"
                          value={formData.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          className={errors.city ? 'border-red-500' : ''}
                        />
                        {errors.city && (
                          <p className="text-sm text-red-600">{errors.city}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zipCode">ZIP Code</Label>
                        <Input
                          id="zipCode"
                          placeholder="10001"
                          value={formData.zipCode}
                          onChange={(e) => handleInputChange('zipCode', e.target.value)}
                          className={errors.zipCode ? 'border-red-500' : ''}
                        />
                        {errors.zipCode && (
                          <p className="text-sm text-red-600">{errors.zipCode}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={isProcessing}>
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing Payment...
                      </>
                    ) : (
                      <>
                        <Lock className="mr-2 h-4 w-4" />
                        Complete Payment - {plan.price}
                      </>
                    )}
                  </Button>

                  <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                    <Shield className="h-4 w-4" />
                    <span>Your payment information is secure and encrypted</span>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Free Plan Signup */}
          {plan.priceValue === 0 && (
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {plan.icon}
                  Get Started with {plan.name}
                </CardTitle>
                <CardDescription>
                  Start your free journey with $pendr
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Account Information</h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className={errors.name ? 'border-red-500' : ''}
                      />
                      {errors.name && (
                        <p className="text-sm text-red-600">{errors.name}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={errors.email ? 'border-red-500' : ''}
                      />
                      {errors.email && (
                        <p className="text-sm text-red-600">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={isProcessing}>
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        {plan.buttonText}
                      </>
                    )}
                  </Button>

                  <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                    <Shield className="h-4 w-4" />
                    <span>Your information is secure and encrypted</span>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Order Summary */}
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">$pendr {plan.name}</h3>
                    <p className="text-sm text-gray-600">Monthly subscription</p>
                  </div>
                  <span className="text-lg font-semibold">{plan.price}</span>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h4 className="font-medium">What's included:</h4>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{plan.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>₹0.00</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>{plan.price}</span>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-medium text-blue-900">14-day free trial</p>
                      <p className="text-blue-700">Cancel anytime during your trial period</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

/* ---------- Outer component: provides Suspense boundary ---------- */
export default function PaymentPage() {
  // Simple fallback while Suspense waits (should be fast)
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    }>
      <PaymentClientInner />
    </Suspense>
  )
}
