'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, Send, Tag, User, AlertCircle, Heart, Upload, X, Image } from 'lucide-react'
import Link from 'next/link'

interface PostWriteProps {
  className?: string
}

const PostWrite = ({ className = '' }: PostWriteProps) => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [currentTag, setCurrentTag] = useState('')
  const [userNickname, setUserNickname] = useState('')
  const [password, setPassword] = useState('')
  const [images, setImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<{[key: string]: string}>({})
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const category = searchParams.get('category') || 'credit-story'

  // 저장된 닉네임 불러오기 또는 자동 생성
  useEffect(() => {
    const generateNickname = () => {
      const adjectives = [
        '희망찬', '새로운', '따뜻한', '용기있는', '지혜로운', '성실한', '꿈꾸는', 
        '밝은', '긍정적인', '열정적인', '차분한', '든든한', '친근한', '진실한'
      ]
      const nouns = [
        '시작', '출발', '여행', '도전', '성장', '변화', '기회', '꿈', '희망', 
        '미래', '내일', '발걸음', '나무', '바람', '햇살', '별빛'
      ]
      const numbers = Math.floor(Math.random() * 900) + 100
      
      const adjective = adjectives[Math.floor(Math.random() * adjectives.length)]
      const noun = nouns[Math.floor(Math.random() * nouns.length)]
      
      return `${adjective}${noun}${numbers}`
    }

    // 브라우저에 저장된 닉네임 불러오기
    const savedNickname = localStorage.getItem('user-nickname')
    if (savedNickname) {
      setUserNickname(savedNickname)
    } else {
      setUserNickname(generateNickname())
    }
  }, [])

  const getCategoryInfo = (cat: string) => {
    const categories: { [key: string]: { name: string; color: string; icon: string; placeholder: string; tips: string[] } } = {
      'credit-story': {
        name: '신용이야기',
        color: 'blue',
        icon: '💳',
        placeholder: '신용점수 관리나 신용카드 관련 경험을 자유롭게 공유해주세요...',
        tips: [
          '구체적인 점수 변화를 언급하면 더 도움이 됩니다',
          '개인정보는 절대 포함하지 마세요',
          '실패 경험도 소중한 정보입니다'
        ]
      },
      'personal-recovery': {
        name: '개인회생',
        color: 'green',
        icon: '🔄',
        placeholder: '개인회생 과정에서의 경험이나 궁금한 점을 나눠주세요...',
        tips: [
          '절차나 준비사항에 대한 구체적인 정보가 도움됩니다',
          '법적 조언이 필요하면 전문가 상담을 권합니다',
          '어려운 시기를 함께 이겨낼 수 있도록 격려해주세요'
        ]
      },
      'corporate-recovery': {
        name: '법인회생',
        color: 'purple',
        icon: '🏢',
        placeholder: '법인회생이나 사업 관련 경험을 공유해주세요...',
        tips: [
          '사업 규모나 업종을 언급하면 더 유용합니다',
          '구체적인 절차나 비용 정보가 도움됩니다',
          '재기 성공 사례는 큰 용기가 됩니다'
        ]
      },
      'loan-story': {
        name: '대출이야기',
        color: 'orange',
        icon: '💰',
        placeholder: '대출 경험이나 관련 정보를 공유해주세요...',
        tips: [
          '금리나 조건 정보가 유용합니다',
          '대출 사기 주의사항도 공유해주세요',
          '상환 계획이나 관리 노하우를 나눠주세요'
        ]
      },
      'success-story': {
        name: '성공사례',
        color: 'emerald',
        icon: '⭐',
        placeholder: '신용회복 성공 이야기를 들려주세요...',
        tips: [
          '구체적인 과정과 기간을 포함해주세요',
          '어려웠던 순간과 극복 방법을 공유해주세요',
          '다른 분들에게 용기를 주는 이야기가 됩니다'
        ]
      }
    }
    return categories[cat] || categories['credit-story']
  }

  const categoryInfo = getCategoryInfo(category)

  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim()) && tags.length < 5) {
      setTags([...tags, currentTag.trim()])
      setCurrentTag('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const validFiles = files.filter(file => {
      const isImage = file.type.startsWith('image/')
      const isValidSize = file.size <= 5 * 1024 * 1024 // 5MB 제한
      return isImage && isValidSize
    })

    if (validFiles.length + images.length > 5) {
      alert('이미지는 최대 5개까지 업로드할 수 있습니다.')
      return
    }

    const newImages = [...images, ...validFiles]
    setImages(newImages)

    // 미리보기 이미지 생성
    validFiles.forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreviews(prev => [...prev, e.target?.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    const newPreviews = imagePreviews.filter((_, i) => i !== index)
    setImages(newImages)
    setImagePreviews(newPreviews)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    const validFiles = files.filter(file => {
      const isImage = file.type.startsWith('image/')
      const isValidSize = file.size <= 5 * 1024 * 1024
      return isImage && isValidSize
    })

    if (validFiles.length + images.length > 5) {
      alert('이미지는 최대 5개까지 업로드할 수 있습니다.')
      return
    }

    const newImages = [...images, ...validFiles]
    setImages(newImages)

    validFiles.forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreviews(prev => [...prev, e.target?.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}
    
    if (!title.trim()) {
      newErrors.title = '제목을 입력해주세요'
    } else if (title.length < 5) {
      newErrors.title = '제목은 5자 이상 입력해주세요'
    }
    
    if (!content.trim()) {
      newErrors.content = '내용을 입력해주세요'
    } else if (content.length < 20) {
      newErrors.content = '내용은 20자 이상 입력해주세요'
    }

    if (!userNickname.trim()) {
      newErrors.nickname = '닉네임을 입력해주세요'
    } else if (userNickname.length < 2) {
      newErrors.nickname = '닉네임은 2자 이상 입력해주세요'
    } else if (userNickname.length > 10) {
      newErrors.nickname = '닉네임은 10자 이하로 입력해주세요'
    }

    if (!password.trim()) {
      newErrors.password = '비밀번호를 입력해주세요'
    } else if (password.length !== 4 || !/^\d{4}$/.test(password)) {
      newErrors.password = '비밀번호는 4자리 숫자로 입력해주세요'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsSubmitting(true)
    
    try {
      // 닉네임을 브라우저에 저장
      localStorage.setItem('user-nickname', userNickname.trim())
      
      // 여기서 실제 DB 저장 로직 구현 (Supabase)
      const postData = {
        title: title.trim(),
        content: content.trim(),
        tags,
        user_nickname: userNickname.trim(),
        password_hash: password, // 실제로는 해시화해서 저장해야 함
        category,
        images: images, // 실제로는 Supabase Storage에 업로드 후 URL 저장
        created_at: new Date().toISOString()
      }
      
      // 임시로 3초 대기 후 목록으로 이동
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // 성공 시 해당 카테고리 페이지로 이동
      router.push(`/${category}`)
    } catch (error) {
      console.error('게시글 작성 실패:', error)
      alert('게시글 작성 중 오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={`max-w-4xl mx-auto ${className}`}>
      {/* 헤더 */}
      <div className="mb-8">
        <Link
          href={`/${category}`}
          className="inline-flex items-center text-gray-600 hover:text-blue-600 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          {categoryInfo.name}로 돌아가기
        </Link>
        
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{categoryInfo.icon}</span>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {categoryInfo.name} 글쓰기
            </h1>
            <p className="text-gray-600 mt-1">
              경험과 지혜를 나누어 함께 성장해요 💪
            </p>
          </div>
        </div>
      </div>

      {/* 안내 메시지 */}
      <div className={`bg-${categoryInfo.color}-50 border border-${categoryInfo.color}-200 rounded-xl p-6 mb-8`}>
        <div className="flex items-start space-x-3">
          <Heart className={`w-6 h-6 text-${categoryInfo.color}-500 flex-shrink-0 mt-0.5`} />
          <div>
            <h3 className={`text-lg font-semibold text-${categoryInfo.color}-900 mb-2`}>
              💡 글쓰기 도움말
            </h3>
            <ul className="space-y-1 text-sm">
              {categoryInfo.tips.map((tip, index) => (
                <li key={index} className={`text-${categoryInfo.color}-800 flex items-start`}>
                  <span className="w-1 h-1 bg-current rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 작성 폼 */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 닉네임 입력 */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            닉네임 <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center space-x-3">
            <User className="w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={userNickname}
              onChange={(e) => setUserNickname(e.target.value)}
              placeholder="사용하실 닉네임을 입력해주세요"
              className={`flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                errors.nickname 
                  ? 'border-red-300 focus:ring-red-500' 
                  : 'border-gray-200 focus:ring-blue-500'
              }`}
              maxLength={10}
            />
          </div>
          {errors.nickname && (
            <div className="flex items-center space-x-1 mt-2 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>{errors.nickname}</span>
            </div>
          )}
          <div className="text-xs text-gray-500 mt-1">
            💚 닉네임은 브라우저에 저장되어 다음에 자동으로 입력됩니다
          </div>
        </div>

        {/* 비밀번호 입력 */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            게시글 비밀번호 <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center space-x-3">
            <span className="text-lg">🔒</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="4자리 숫자 입력 (수정/삭제시 필요)"
              className={`flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                errors.password 
                  ? 'border-red-300 focus:ring-red-500' 
                  : 'border-gray-200 focus:ring-blue-500'
              }`}
              maxLength={4}
            />
          </div>
          {errors.password && (
            <div className="flex items-center space-x-1 mt-2 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>{errors.password}</span>
            </div>
          )}
          <div className="text-xs text-gray-500 mt-1">
            ⚠️ 게시글 수정이나 삭제할 때 필요합니다. 꼭 기억해주세요!
          </div>
        </div>

        {/* 제목 */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            제목 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력해주세요"
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
              errors.title 
                ? 'border-red-300 focus:ring-red-500' 
                : 'border-gray-200 focus:ring-blue-500'
            }`}
            maxLength={100}
          />
          {errors.title && (
            <div className="flex items-center space-x-1 mt-2 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>{errors.title}</span>
            </div>
          )}
          <div className="text-right text-xs text-gray-500 mt-1">
            {title.length}/100
          </div>
        </div>

        {/* 내용 */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            내용 <span className="text-red-500">*</span>
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={categoryInfo.placeholder}
            rows={15}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors resize-none ${
              errors.content 
                ? 'border-red-300 focus:ring-red-500' 
                : 'border-gray-200 focus:ring-blue-500'
            }`}
            maxLength={3000}
          />
          {errors.content && (
            <div className="flex items-center space-x-1 mt-2 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>{errors.content}</span>
            </div>
          )}
          <div className="text-right text-xs text-gray-500 mt-1">
            {content.length}/3000
          </div>
        </div>

        {/* 태그 */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            태그 (선택사항)
          </label>
          <div className="flex items-center space-x-2 mb-3">
            <Tag className="w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="태그를 입력하고 Enter를 누르세요"
              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={tags.length >= 5}
            />
            <button
              type="button"
              onClick={handleAddTag}
              disabled={!currentTag.trim() || tags.length >= 5}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              추가
            </button>
          </div>
          
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className={`bg-${categoryInfo.color}-100 text-${categoryInfo.color}-700 px-3 py-1 rounded-full text-sm flex items-center space-x-1`}
                >
                  <span>#{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-red-600 ml-1"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
          
          <div className="text-xs text-gray-500">
            태그는 최대 5개까지 추가할 수 있습니다. ({tags.length}/5)
          </div>
        </div>

        {/* 이미지 업로드 */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            이미지 (선택사항)
          </label>
          
          {/* 이미지 업로드 버튼 */}
          <div className="mb-4">
            <label 
              className={`inline-flex items-center justify-center w-full p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                isDragOver 
                  ? 'border-blue-500 bg-blue-50' 
                  : images.length >= 5 
                    ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                    : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="text-center">
                <Upload className={`w-8 h-8 mx-auto mb-2 ${isDragOver ? 'text-blue-500' : 'text-gray-400'}`} />
                <span className={`text-sm ${isDragOver ? 'text-blue-600' : 'text-gray-600'}`}>
                  {isDragOver 
                    ? '이미지를 여기에 놓으세요' 
                    : images.length >= 5 
                      ? '이미지 업로드 한도에 도달했습니다'
                      : '클릭하여 이미지를 선택하거나 드래그해서 놓으세요'
                  }
                </span>
                <span className="text-xs text-gray-500 block mt-1">
                  JPG, PNG, GIF (최대 5MB, 5개까지)
                </span>
              </div>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={images.length >= 5}
              />
            </label>
          </div>

          {/* 이미지 미리보기 */}
          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative group">
                  <img
                    src={preview}
                    alt={`미리보기 ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
          
          <div className="text-xs text-gray-500 mt-2">
            📸 이미지는 최대 5개까지 업로드할 수 있습니다. ({images.length}/5)
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex items-center justify-between pt-6">
          <Link
            href={`/${category}`}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            취소
          </Link>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-8 py-3 bg-gradient-to-r from-${categoryInfo.color}-600 to-blue-600 text-white font-semibold rounded-lg hover:from-${categoryInfo.color}-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-2`}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>작성 중...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>게시글 작성</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default PostWrite 