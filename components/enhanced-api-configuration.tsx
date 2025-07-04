"use client"

import type React from "react"

import { useState } from "react"
import { Zap, Eye, EyeOff, Check, X, AlertTriangle, Info, ExternalLink } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"

// Replace the PROVIDER_INFO constant with this updated version that includes all providers
const PROVIDER_INFO = {
  huggingface: {
    name: "Hugging Face",
    description: "Open-source models via Inference Providers",
    models: [
      "meta-llama/Meta-Llama-3.3-70B-Instruct", 
      "Qwen/Qwen2.5-7B-Instruct-1M", 
      "microsoft/Phi-4", 
      "deepseek-ai/DeepSeek-R1",
      "google/gemma-2-2b-it"
    ],
    defaultModel: "meta-llama/Meta-Llama-3.3-70B-Instruct",
    baseUrl: "https://api-inference.huggingface.co",
    features: ["Text Generation", "Embeddings", "Free Tier"],
    limitations: ["Rate Limited", "Cold Start Delays", "Model Loading Time"],
    signupUrl: "https://huggingface.co/settings/tokens",
    embeddingSupport: true,
    disabled: false,
  },
  openai: {
    name: "OpenAI",
    description: "Premium API with high-quality models",
    models: ["gpt-4o", "gpt-4o-mini", "o1-preview", "o1-mini", "gpt-4-turbo"],
    defaultModel: "gpt-4o-mini",
    baseUrl: "https://api.openai.com/v1",
    features: ["High Quality", "Fast Response", "Latest Models"],
    limitations: ["Paid Service", "Usage Limits", "API Costs"],
    signupUrl: "https://platform.openai.com/api-keys",
    embeddingSupport: true,
    disabled: false,
  },
  anthropic: {
    name: "Anthropic",
    description: "Claude models with strong reasoning",
    models: ["claude-3-5-sonnet-20241022", "claude-3-5-haiku-20241022", "claude-3-opus-20240229"],
    defaultModel: "claude-3-5-sonnet-20241022",
    baseUrl: "https://api.anthropic.com",
    features: ["Strong Reasoning", "Long Context", "Safety Focused"],
    limitations: ["Paid Service", "No Embeddings", "Limited Availability"],
    signupUrl: "https://console.anthropic.com/",
    embeddingSupport: false,
    disabled: false,
  },
  aiml: {
    name: "AI/ML API",
    description: "Unified access to 200+ AI models",
    models: [
      "gpt-4o",
      "gpt-4o-mini", 
      "claude-3-5-sonnet",
      "deepseek-v3",
      "deepseek-r1",
      "llama-3.3-70b",
      "gemini-2.5-pro",
      "gemini-2.5-flash"
    ],
    defaultModel: "gpt-4o-mini",
    baseUrl: "https://api.aimlapi.com/v1",
    features: ["200+ Models", "Competitive Pricing", "OpenAI Compatible"],
    limitations: ["Paid Service", "Third Party", "Model Availability"],
    signupUrl: "https://aimlapi.com/",
    embeddingSupport: true,
    disabled: false,
  },
  groq: {
    name: "Groq",
    description: "Ultra-fast inference with specialized hardware",
    models: [
      "llama-3.3-70b-versatile", 
      "llama-3.1-8b-instant", 
      "gemma2-9b-it",
      "deepseek-r1-distill-llama-70b"
    ],
    defaultModel: "llama-3.1-8b-instant",
    baseUrl: "https://api.groq.com/openai/v1",
    features: ["Ultra Fast", "Low Latency", "Open Source Models"],
    limitations: ["Limited Models", "No Embeddings", "Rate Limits"],
    signupUrl: "https://console.groq.com/keys",
    embeddingSupport: false,
    disabled: false,
  },
  openrouter: {
    name: "OpenRouter",
    description: "Universal gateway to 400+ AI models",
    models: [
      "openai/gpt-4o",
      "openai/gpt-4o-mini", 
      "anthropic/claude-3.5-sonnet",
      "meta-llama/llama-3.3-70b-instruct",
      "google/gemini-2.0-flash-exp",
      "deepseek/deepseek-v3",
      "openai/o1-preview"
    ],
    defaultModel: "openai/gpt-4o-mini",
    baseUrl: "https://openrouter.ai/api/v1",
    features: ["400+ Models", "Unified API", "Fallback Options"],
    limitations: ["Third Party", "Added Latency", "Cost Markup"],
    signupUrl: "https://openrouter.ai/keys",
    embeddingSupport: true,
    disabled: false,
  },

  deepinfra: {
    name: "DeepInfra",
    description: "Serverless open-source models",
    models: [
      "meta-llama/Meta-Llama-3.3-70B-Instruct", 
      "Qwen/Qwen2.5-72B-Instruct",
      "deepseek-ai/DeepSeek-V3"
    ],
    defaultModel: "meta-llama/Meta-Llama-3.3-70B-Instruct",
    baseUrl: "https://api.deepinfra.com/v1/openai",
    features: ["Serverless", "Open Source Models", "Low Cost"],
    limitations: ["No Embeddings", "Limited Features", "API Reliability"],
    signupUrl: "https://deepinfra.com/",
    embeddingSupport: false,
    disabled: false,
  },
  deepseek: {
    name: "DeepSeek",
    description: "Advanced reasoning models",
    models: ["deepseek-chat", "deepseek-coder", "deepseek-r1"],
    defaultModel: "deepseek-r1",
    baseUrl: "https://api.deepseek.com/v1",
    features: ["Advanced Reasoning", "Code Generation", "Cost Effective"],
    limitations: ["No Embeddings", "Limited Availability", "API Costs"],
    signupUrl: "https://platform.deepseek.com/",
    embeddingSupport: false,
    disabled: false,
  },
  googleai: {
    name: "Google AI Studio",
    description: "Gemini models with multimodal capabilities",
    models: [
      "gemini-2.5-pro", 
      "gemini-2.5-flash", 
      "gemini-2.0-flash-exp",
      "gemini-1.5-pro"
    ],
    defaultModel: "gemini-2.5-flash",
    baseUrl: "https://generativelanguage.googleapis.com/v1",
    features: ["Multimodal", "Google Knowledge", "Fast Response"],
    limitations: ["No Embeddings", "API Costs", "Limited Models"],
    signupUrl: "https://aistudio.google.com/",
    embeddingSupport: false,
    disabled: false,
  },
  vertex: {
    name: "Google Vertex AI",
    description: "Enterprise AI platform with embeddings",
    models: ["gemini-2.5-pro", "gemini-2.5-flash", "text-embedding-gecko"],
    defaultModel: "gemini-2.5-pro",
    baseUrl: "https://us-central1-aiplatform.googleapis.com/v1",
    features: ["Enterprise Grade", "Embeddings", "Google Cloud Integration"],
    limitations: ["Complex Setup", "API Costs", "GCP Required"],
    signupUrl: "https://console.cloud.google.com/",
    embeddingSupport: true,
    disabled: false,
  },
  mistral: {
    name: "Mistral AI",
    description: "European AI models with strong capabilities",
    models: ["mistral-large-latest", "mistral-medium-latest", "mistral-small-latest"],
    defaultModel: "mistral-large-latest",
    baseUrl: "https://api.mistral.ai/v1",
    features: ["European Hosting", "Strong Performance", "Privacy Focus"],
    limitations: ["No Embeddings", "Limited Models", "API Costs"],
    signupUrl: "https://console.mistral.ai/",
    embeddingSupport: false,
    disabled: false,
  },
  perplexity: {
    name: "Perplexity",
    description: "Search-augmented models with real-time knowledge",
    models: [
      "llama-3.1-sonar-large-128k-online", 
      "llama-3.1-sonar-small-128k-online",
      "llama-3.1-sonar-huge-128k-online"
    ],
    defaultModel: "llama-3.1-sonar-small-128k-online",
    baseUrl: "https://api.perplexity.ai",
    features: ["Real-time Knowledge", "Search Augmented", "Online Access"],
    limitations: ["No Embeddings", "Limited Features", "API Costs"],
    signupUrl: "https://www.perplexity.ai/settings/api",
    embeddingSupport: false,
    disabled: false,
  },

  xai: {
    name: "xAI (Grok)",
    description: "Real-time knowledge models",
    models: ["grok-3-beta", "grok-3-mini-beta", "grok-beta"],
    defaultModel: "grok-3-mini-beta",
    baseUrl: "https://api.xai.com/v1",
    features: ["Real-time Knowledge", "Strong Reasoning", "Fast Response"],
    limitations: ["No Embeddings", "Limited Availability", "API Costs"],
    signupUrl: "https://grok.x.ai/",
    embeddingSupport: false,
    disabled: false,
  },
  alibaba: {
    name: "Alibaba Cloud",
    description: "Qwen models with multilingual capabilities",
    models: ["qwen-max", "qwen-plus", "qwen-turbo"],
    defaultModel: "qwen-turbo",
    baseUrl: "https://dashscope.aliyuncs.com/api/v1",
    features: ["Multilingual", "Chinese Excellence", "Cloud Integration"],
    limitations: ["No Embeddings", "Limited Global Availability", "API Costs"],
    signupUrl: "https://www.alibabacloud.com/",
    embeddingSupport: false,
    disabled: false,
  },
  minimax: {
    name: "MiniMax",
    description: "Chinese conversational AI models",
    models: ["abab5.5-chat", "abab5-chat", "abab4-chat"],
    defaultModel: "abab5.5-chat",
    baseUrl: "https://api.minimax.chat/v1",
    features: ["Chinese Excellence", "Conversational Focus", "Cultural Context"],
    limitations: ["No Embeddings", "Limited Global Availability", "API Costs"],
    signupUrl: "https://api.minimax.chat/",
    embeddingSupport: false,
    disabled: false,
  },
}

// Update the AIConfig interface to include all the new providers
interface AIConfig {
  provider:
    | "huggingface"
    | "openai"
    | "anthropic"
    | "aiml"
    | "groq"
    | "openrouter"
    | "deepinfra"
    | "deepseek"
    | "googleai"
    | "vertex"
    | "mistral"
    | "perplexity"
    | "xai"
    | "alibaba"
    | "minimax"
  apiKey: string
  model: string
  baseUrl?: string
}

interface EnhancedAPIConfigurationProps {
  config: AIConfig
  onConfigChange: (config: AIConfig) => void
  onTestConnection: (config: AIConfig) => Promise<boolean>
  onError: (error: string, details?: string) => void
  onSuccess: (message: string) => void
}

// Update the handleProviderChange function to check for disabled providers
const handleProviderChange = ({
  provider,
  onConfigChange,
  onError,
  config,
  setConnectionStatus,
}: {
  provider: AIConfig["provider"]
  onConfigChange: EnhancedAPIConfigurationProps["onConfigChange"]
  onError: EnhancedAPIConfigurationProps["onError"]
  config: AIConfig
  setConnectionStatus: React.Dispatch<React.SetStateAction<"idle" | "success" | "error">>
}) => {
  const providerInfo = PROVIDER_INFO[provider]

  // Check if the provider is disabled
  if (providerInfo.disabled) {
    onError("Provider Disabled", `${providerInfo.name} is currently disabled. Please select another provider.`)
    return
  }

  onConfigChange({
    ...config,
    provider,
    model: providerInfo.defaultModel,
    baseUrl: providerInfo.baseUrl,
    apiKey: "", // Clear API key when switching providers
  })
  setConnectionStatus("idle")
}

export function EnhancedAPIConfiguration({
  config,
  onConfigChange,
  onTestConnection,
  onError,
  onSuccess,
}: EnhancedAPIConfigurationProps) {
  const [showApiKey, setShowApiKey] = useState(false)
  const [isTestingConnection, setIsTestingConnection] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "success" | "error">("idle")
  const [testProgress, setTestProgress] = useState(0)

  const currentProvider = PROVIDER_INFO[config.provider]

  const handleModelChange = (model: string) => {
    onConfigChange({
      ...config,
      model,
    })
    setConnectionStatus("idle")
  }

  const handleApiKeyChange = (apiKey: string) => {
    onConfigChange({
      ...config,
      apiKey,
    })
    setConnectionStatus("idle")
  }

  const handleBaseUrlChange = (baseUrl: string) => {
    onConfigChange({
      ...config,
      baseUrl,
    })
    setConnectionStatus("idle")
  }

  const validateConfig = (): string | null => {
    if (!config.apiKey.trim()) {
      return "API key is required"
    }

    if (!config.model.trim()) {
      return "Model selection is required"
    }

    if (config.baseUrl && config.baseUrl.trim() && !isValidUrl(config.baseUrl)) {
      return "Invalid base URL format"
    }

    return null
  }

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const handleTestConnection = async () => {
    const validationError = validateConfig()
    if (validationError) {
      onError("Configuration Error", validationError)
      return
    }

    setIsTestingConnection(true)
    setConnectionStatus("idle")
    setTestProgress(0)

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setTestProgress((prev) => Math.min(prev + 10, 90))
      }, 200)

      const success = await onTestConnection(config)

      clearInterval(progressInterval)
      setTestProgress(100)

      if (success) {
        setConnectionStatus("success")
        onSuccess(`Successfully connected to ${currentProvider.name}`)
      } else {
        setConnectionStatus("error")
        onError(
          "Connection Failed",
          `Unable to connect to ${currentProvider.name}. Please check your API key and try again.`,
        )
      }
    } catch (error) {
      setConnectionStatus("error")
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
      onError("Connection Test Failed", errorMessage)
    } finally {
      setIsTestingConnection(false)
      setTimeout(() => setTestProgress(0), 1000)
    }
  }

  const getConnectionStatusIcon = () => {
    switch (connectionStatus) {
      case "success":
        return <Check className="w-4 h-4 text-green-600" />
      case "error":
        return <X className="w-4 h-4 text-red-600" />
      default:
        return null
    }
  }

  return (
    <Card className="border-2 border-black shadow-none">
      <CardHeader className="border-b border-black">
        <CardTitle className="flex items-center space-x-2">
          <Zap className="w-5 h-5" />
          <span>AI PROVIDER CONFIGURATION</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        {/* Provider Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Provider</label>
          {/* Update the Select component to show disabled state for providers */}
          <Select
            value={config.provider}
            onValueChange={(value) =>
              handleProviderChange({
                provider: value as AIConfig["provider"],
                onConfigChange,
                onError,
                config,
                setConnectionStatus,
              })
            }
          >
            <SelectTrigger className="border-2 border-black focus:ring-0 focus:border-black">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(PROVIDER_INFO).map(([key, info]) => (
                <SelectItem
                  key={key}
                  value={key}
                  disabled={info.disabled}
                  className={info.disabled ? "opacity-50 cursor-not-allowed" : ""}
                >
                  <div className="flex items-center space-x-2">
                    <span>{info.name}</span>
                    {info.disabled && (
                      <Badge variant="outline" className="text-xs bg-red-100 border-red-300">
                        Disabled
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-xs">
                      {info.embeddingSupport ? "Embeddings" : "Text Only"}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Provider Information */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p className="text-sm">
                <strong>{currentProvider.name}:</strong> {currentProvider.description}
              </p>
              <div className="flex flex-wrap gap-1">
                {currentProvider.features.map((feature) => (
                  <Badge key={feature} variant="outline" className="text-xs border-green-600 text-green-600">
                    {feature}
                  </Badge>
                ))}
              </div>
              {currentProvider.limitations.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {currentProvider.limitations.map((limitation) => (
                    <Badge key={limitation} variant="outline" className="text-xs border-yellow-600 text-yellow-600">
                      {limitation}
                    </Badge>
                  ))}
                </div>
              )}
              <div className="flex items-center space-x-2">
                <span className="text-xs">Need an API key?</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.open(currentProvider.signupUrl, "_blank")}
                  className="h-6 text-xs border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Get API Key
                </Button>
              </div>
            </div>
          </AlertDescription>
        </Alert>

        {/* Embedding Support Warning */}
        {!currentProvider.embeddingSupport && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Warning:</strong> {currentProvider.name} does not support embeddings. Document processing will use
              fallback embeddings, which may reduce accuracy.
            </AlertDescription>
          </Alert>
        )}

        {/* API Key Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium">API Key</label>
          <div className="relative">
            <Input
              type={showApiKey ? "text" : "password"}
              value={config.apiKey}
              onChange={(e) => handleApiKeyChange(e.target.value)}
              placeholder={`Enter your ${currentProvider.name} API key`}
              className="border-2 border-black focus:ring-0 focus:border-black pr-20"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
              {getConnectionStatusIcon()}
              <button type="button" onClick={() => setShowApiKey(!showApiKey)} className="p-1 hover:bg-gray-100">
                {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div className="text-xs text-gray-600">
            Get your API key from{" "}
            <a
              href={currentProvider.signupUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {currentProvider.name}
            </a>
          </div>
        </div>

        {/* Model Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Model</label>
          <Select value={config.model} onValueChange={handleModelChange}>
            <SelectTrigger className="border-2 border-black focus:ring-0 focus:border-black">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {currentProvider.models.map((model) => (
                <SelectItem key={model} value={model}>
                  {model}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Base URL (Advanced) */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Base URL (Advanced)</label>
          <Input
            value={config.baseUrl || ""}
            onChange={(e) => handleBaseUrlChange(e.target.value)}
            placeholder={currentProvider.baseUrl}
            className="border-2 border-black focus:ring-0 focus:border-black"
          />
          <div className="text-xs text-gray-600">
            Leave empty to use default. Only change if using a custom endpoint.
          </div>
        </div>

        {/* Test Connection */}
        <div className="space-y-2">
          {isTestingConnection && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Testing connection...</span>
                <span>{testProgress}%</span>
              </div>
              <Progress value={testProgress} className="h-2" />
            </div>
          )}

          <Button
            onClick={handleTestConnection}
            disabled={!config.apiKey.trim() || isTestingConnection}
            className="w-full border-2 border-black bg-white text-black hover:bg-black hover:text-white"
          >
            {isTestingConnection ? "Testing..." : "Test Connection"}
          </Button>
        </div>

        {/* Connection Status */}
        <div className="pt-2 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <span>Connection Status:</span>
            <Badge
              variant="outline"
              className={
                connectionStatus === "success"
                  ? "border-green-600 text-green-600"
                  : connectionStatus === "error"
                    ? "border-red-600 text-red-600"
                    : "border-gray-400 text-gray-600"
              }
            >
              {connectionStatus === "success" ? "Connected" : connectionStatus === "error" ? "Error" : "Not Tested"}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
