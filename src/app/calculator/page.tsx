'use client';

import { useState } from 'react';
import Link from 'next/link';
import MobileNavigation from '../components/MobileNavigation';

export default function CalculatorPage() {
  const [showStickyAd, setShowStickyAd] = useState(true);
  const [activeTab, setActiveTab] = useState('loan');
  
  // 대출 이자 계산기 상태
  const [loanAmount, setLoanAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [loanPeriod, setLoanPeriod] = useState('');
  const [repaymentType, setRepaymentType] = useState('equal-payment'); // 상환방식
  const [gracePeriod, setGracePeriod] = useState(''); // 거치기간
  const [loanResult, setLoanResult] = useState<any>(null);
  
  // 개인회생 변제금 계산기 상태
  const [totalDebt, setTotalDebt] = useState('');
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [familySize, setFamilySize] = useState('');
  const [hasAssets, setHasAssets] = useState(false);
  const [assetValue, setAssetValue] = useState('');
  const [age, setAge] = useState('');
  const [debtCause, setDebtCause] = useState('');
  const [jobType, setJobType] = useState('');
  const [isBasicLivelihood, setIsBasicLivelihood] = useState(false);
  const [hasChronicDisease, setHasChronicDisease] = useState(false);
  const [dependents, setDependents] = useState('');
  const [recoveryResult, setRecoveryResult] = useState<any>(null);

  // 숫자 포맷팅 함수 (콤마 추가)
  const formatNumber = (value: string | number): string => {
    if (!value) return '';
    const number = value.toString().replace(/,/g, '');
    if (isNaN(Number(number))) return value.toString();
    return parseInt(number).toLocaleString();
  };

  // 숫자 값 추출 함수 (콤마 제거)
  const parseNumber = (value: string | number) => {
    return parseFloat(value.toString().replace(/,/g, '')) || 0;
  };

  // 금액 입력 핸들러
  const handleAmountChange = (value: string, setter: (value: string) => void) => {
    const formatted = formatNumber(value);
    setter(formatted);
  };

  // 대출 이자 계산 (다양한 상환방식)
  const calculateLoan = () => {
    const principal = parseNumber(loanAmount);
    const rate = parseFloat(interestRate) / 100 / 12;
    const totalMonths = parseInt(loanPeriod) * 12;
    const graceMonths = parseInt(gracePeriod) || 0;
    
    if (principal && rate && totalMonths) {
      const result: any = {};
      
      if (repaymentType === 'equal-payment') {
        // 원리금균등상환
        const monthlyPayment = (principal * rate * Math.pow(1 + rate, totalMonths)) / (Math.pow(1 + rate, totalMonths) - 1);
        const totalPayment = monthlyPayment * totalMonths;
        const totalInterest = totalPayment - principal;
        
        result.equalPayment = {
          monthlyPayment: Math.round(monthlyPayment),
          totalPayment: Math.round(totalPayment),
          totalInterest: Math.round(totalInterest)
        };
      }
      
      if (repaymentType === 'equal-principal') {
        // 원금균등상환
        const principalPayment = principal / totalMonths;
        const firstInterest = principal * rate;
        const firstPayment = principalPayment + firstInterest;
        const lastPayment = principalPayment + (principalPayment * rate);
        const totalInterest = (firstInterest + (principalPayment * rate)) * totalMonths / 2;
        
        result.equalPrincipal = {
          principalPayment: Math.round(principalPayment),
          firstPayment: Math.round(firstPayment),
          lastPayment: Math.round(lastPayment),
          totalPayment: Math.round(principal + totalInterest),
          totalInterest: Math.round(totalInterest)
        };
      }
      
      if (repaymentType === 'maturity') {
        // 만기일시상환
        const monthlyInterest = principal * rate;
        const totalInterest = monthlyInterest * totalMonths;
        const finalPayment = principal + monthlyInterest;
        
        result.maturity = {
          monthlyInterest: Math.round(monthlyInterest),
          finalPayment: Math.round(finalPayment),
          totalPayment: Math.round(principal + totalInterest),
          totalInterest: Math.round(totalInterest)
        };
      }
      
      if (repaymentType === 'grace' && graceMonths > 0) {
        // 거치기간 후 원리금균등상환
        const graceInterest = principal * rate;
        const repaymentMonths = totalMonths - graceMonths;
        const monthlyPayment = (principal * rate * Math.pow(1 + rate, repaymentMonths)) / (Math.pow(1 + rate, repaymentMonths) - 1);
        const graceTotal = graceInterest * graceMonths;
        const repaymentTotal = monthlyPayment * repaymentMonths;
        const totalPayment = graceTotal + repaymentTotal;
        
        result.grace = {
          graceInterest: Math.round(graceInterest),
          graceTotal: Math.round(graceTotal),
          monthlyPayment: Math.round(monthlyPayment),
          repaymentMonths: repaymentMonths,
          totalPayment: Math.round(totalPayment),
          totalInterest: Math.round(totalPayment - principal)
        };
      }
      
      setLoanResult(result);
    }
  };

  // 개인회생 변제금 계산 (법원 기준 반영)
  const calculateRecovery = () => {
    const debt = parseNumber(totalDebt);
    const income = parseNumber(monthlyIncome);
    const family = parseInt(familySize) || 1;
    const assets = hasAssets ? parseNumber(assetValue) : 0;
    const userAge = parseInt(age) || 30;
    const dependentCount = parseInt(dependents) || 0;
    
    if (debt && income) {
      // 기초생활수급자는 변제 면제 또는 극소 변제
      if (isBasicLivelihood) {
        setRecoveryResult({
          livingCost: 0,
          disposableIncome: 0,
          liquidationValue: 0,
          monthlyRepayment: 0,
          totalRepayment: 0,
          repaymentRate: 0,
          remainingDebt: Math.round(debt),
          specialStatus: "기초생활수급자 - 변제 면제 대상"
        });
        return;
      }

      // 최저생계비 계산 (2024년 기준)
      const baseLivingCost: { [key: number]: number } = {
        1: 1200000,
        2: 1800000,
        3: 2200000,
        4: 2600000,
        5: 3000000
      };
      
      let livingCost = baseLivingCost[family] || baseLivingCost[5] + (family - 5) * 400000;
      
      // 부양가족 추가 고려
      livingCost += dependentCount * 300000;
      
      // 중증질환자 추가 생계비
      if (hasChronicDisease) {
        livingCost += 500000;
      }
      
      // 고령자 추가 생계비
      if (userAge >= 65) {
        livingCost += 200000;
      }
      
      const disposableIncome = Math.max(0, income - livingCost);
      
      // 변제기간 결정
      let repaymentPeriod = 60; // 기본 5년
      if (userAge >= 60) repaymentPeriod = 36; // 고령자 3년
      if (hasChronicDisease) repaymentPeriod = 36; // 중증질환자 3년
      
      // 청산가치 계산
      const liquidationValue = assets * 0.8;
      
      // 총 변제가능금액
      const totalRepaymentCapacity = (disposableIncome * repaymentPeriod) + liquidationValue;
      
      // 기본 변제율 계산
      const baseRepaymentRate = Math.min(100, (totalRepaymentCapacity / debt) * 100);
      
      // 부채 원인별 조정
      let adjustmentFactor = 1.0;
      let statusNote = "";
      
      switch (debtCause) {
        case 'gambling':
          adjustmentFactor = 1.5; // 도박 부채는 변제율 증가
          statusNote = "도박성 부채로 변제율 상향 조정";
          break;
        case 'luxury':
          adjustmentFactor = 1.3; // 사치성 부채
          statusNote = "사치성 부채로 변제율 상향 조정";
          break;
        case 'business':
          adjustmentFactor = 0.8; // 사업실패는 변제율 감소
          statusNote = "사업실패로 변제율 하향 조정";
          break;
        case 'medical':
          adjustmentFactor = 0.7; // 의료비는 변제율 감소
          statusNote = "의료비 부채로 변제율 하향 조정";
          break;
        case 'living':
          adjustmentFactor = 0.9; // 생계형 부채
          statusNote = "생계형 부채로 변제율 하향 조정";
          break;
        default:
          statusNote = "일반 부채";
      }
      
      // 직업 안정성 고려
      if (jobType === 'irregular') {
        adjustmentFactor *= 0.9; // 비정규직 10% 감소
      } else if (jobType === 'self-employed') {
        adjustmentFactor *= 0.85; // 자영업 15% 감소
      }
      
      // 조정된 변제율 계산
      let adjustedRepaymentRate = baseRepaymentRate * adjustmentFactor;
      
      // 최종 변제율 범위 조정
      if (adjustedRepaymentRate < 10) {
        adjustedRepaymentRate = Math.max(10, adjustedRepaymentRate); // 최소 10%
      } else if (adjustedRepaymentRate > 100) {
        adjustedRepaymentRate = 100; // 최대 100%
      }
      
      // 특수 상황 처리
      if (userAge >= 70 || hasChronicDisease) {
        adjustedRepaymentRate = Math.min(adjustedRepaymentRate, 30); // 고령자/중증질환자 최대 30%
      }
      
      const totalActualRepayment = debt * (adjustedRepaymentRate / 100);
      const monthlyRepayment = totalActualRepayment / repaymentPeriod;
      
      setRecoveryResult({
        livingCost: Math.round(livingCost),
        disposableIncome: Math.round(disposableIncome),
        liquidationValue: Math.round(liquidationValue),
        monthlyRepayment: Math.round(monthlyRepayment),
        totalRepayment: Math.round(totalActualRepayment),
        repaymentRate: Math.round(adjustedRepaymentRate * 10) / 10,
        remainingDebt: Math.round(debt - totalActualRepayment),
        repaymentPeriod: repaymentPeriod,
        statusNote: statusNote,
        baseRate: Math.round(baseRepaymentRate * 10) / 10
      });
    }
  };

  return (
    <div className="font-pretendard font-light min-h-screen bg-white">
      {/* 모바일 네비게이션 */}
      <MobileNavigation currentPage="/calculator" />
      {/* 헤더 */}
      <header className="border-b border-gray-200 bg-white sticky top-0">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <div>
                <h1 className="text-xl font-normal text-black">
                  <Link href="/" className="hover:text-blue-600">크레딧스토리</Link>
                </h1>
                <p className="text-xs text-gray-500 -mt-1 text-right">Credit Story</p>
              </div>
              <nav className="hidden md:block">
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                  <Link href="/" className="text-gray-700 hover:text-blue-600 text-sm transition-colors duration-200">전체</Link>
                  <Link href="/credit" className="text-gray-700 hover:text-blue-600 text-sm transition-colors duration-200">신용이야기</Link>
                  <Link href="/personal" className="text-gray-700 hover:text-blue-600 text-sm transition-colors duration-200">개인회생</Link>
                  <Link href="/corporate" className="text-gray-700 hover:text-blue-600 text-sm transition-colors duration-200">법인회생</Link>
                  <Link href="/workout" className="text-gray-700 hover:text-blue-600 text-sm transition-colors duration-200">워크아웃</Link>
                  <Link href="/card" className="text-gray-700 hover:text-blue-600 text-sm transition-colors duration-200">신용카드</Link>
                  <Link href="/loan" className="text-gray-700 hover:text-blue-600 text-sm transition-colors duration-200">대출</Link>
                  <Link href="/news" className="text-gray-700 hover:text-blue-600 text-sm transition-colors duration-200">뉴스정보</Link>
                  <Link href="/calculator" className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-200">계산기</Link>
                </div>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              {/* 글쓰기 버튼을 메인 영역으로 이동 */}
            </div>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* 카테고리 제목 */}
        <div className="mb-6">
          <h2 className="text-2xl font-normal text-black mb-2">계산기</h2>
          <p className="text-sm text-gray-600">다양한 금융 계산기로 미리 계획해보세요</p>
        </div>

        {/* 프리미엄 광고 */}
        <div className="mb-6 flex justify-center">
          <div className="w-[728px] h-[90px] bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 flex items-center justify-center text-sm text-blue-600 rounded-lg">
            <div className="text-center">
              <div className="text-lg mb-1">신용회복 전문 상담센터 - 프리미엄 광고</div>
              <div className="text-xs text-blue-500">24시간 무료 상담 | 성공률 95% | 맞춤 솔루션 제공</div>
            </div>
          </div>
        </div>
        
        {/* 글쓰기 버튼 */}
        <div className="flex justify-center mb-6">
          <div className="w-[728px] flex justify-end">
            <a 
              href="/write" 
              className="px-3 py-1.5 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors text-xs font-medium"
            >
              작성하기
            </a>
          </div>
        </div>

        {/* 탭 메뉴 */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('loan')}
                className={`py-2 px-1 border-b-2 text-sm font-medium ${
                  activeTab === 'loan'
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                대출 계산기
              </button>
              <button
                onClick={() => setActiveTab('recovery')}
                className={`py-2 px-1 border-b-2 text-sm font-medium ${
                  activeTab === 'recovery'
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                개인회생 변제금 계산기
              </button>
            </nav>
          </div>
        </div>

        {/* 대출 계산기 */}
        {activeTab === 'loan' && (
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-medium text-black mb-4">대출 계산기</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    대출 금액 (원)
                  </label>
                  <input
                    type="text"
                    value={loanAmount}
                    onChange={(e) => handleAmountChange(e.target.value, setLoanAmount)}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
                    placeholder="10,000,000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    연 이자율 (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
                    placeholder="4.5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    대출 기간 (년)
                  </label>
                  <input
                    type="number"
                    value={loanPeriod}
                    onChange={(e) => setLoanPeriod(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
                    placeholder="10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    상환 방식
                  </label>
                  <select
                    value={repaymentType}
                    onChange={(e) => setRepaymentType(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    <option value="equal-payment">원리금균등상환</option>
                    <option value="equal-principal">원금균등상환</option>
                    <option value="maturity">만기일시상환</option>
                    <option value="grace">거치기간 후 상환</option>
                  </select>
                </div>
                {repaymentType === 'grace' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      거치 기간 (개월)
                    </label>
                    <input
                      type="number"
                      value={gracePeriod}
                      onChange={(e) => setGracePeriod(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
                      placeholder="12"
                    />
                  </div>
                )}
                <button
                  onClick={calculateLoan}
                  className="w-full bg-gray-900 text-white py-3 rounded hover:bg-gray-800"
                >
                  계산하기
                </button>
              </div>
              
              {loanResult && (
                <div className="space-y-4">
                  {/* 원리금균등상환 결과 */}
                  {loanResult.equalPayment && (
                    <div className="bg-gray-50 p-4 rounded">
                      <h4 className="text-md font-medium text-black mb-3">원리금균등상환</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>월 상환액:</span>
                          <span className="font-medium">{loanResult.equalPayment.monthlyPayment.toLocaleString()}원</span>
                        </div>
                        <div className="flex justify-between">
                          <span>총 상환액:</span>
                          <span className="font-medium">{loanResult.equalPayment.totalPayment.toLocaleString()}원</span>
                        </div>
                        <div className="flex justify-between">
                          <span>총 이자:</span>
                          <span className="font-medium text-red-600">{loanResult.equalPayment.totalInterest.toLocaleString()}원</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* 원금균등상환 결과 */}
                  {loanResult.equalPrincipal && (
                    <div className="bg-gray-50 p-4 rounded">
                      <h4 className="text-md font-medium text-black mb-3">원금균등상환</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>월 원금:</span>
                          <span className="font-medium">{loanResult.equalPrincipal.principalPayment.toLocaleString()}원</span>
                        </div>
                        <div className="flex justify-between">
                          <span>첫 월 상환액:</span>
                          <span className="font-medium">{loanResult.equalPrincipal.firstPayment.toLocaleString()}원</span>
                        </div>
                        <div className="flex justify-between">
                          <span>마지막 월 상환액:</span>
                          <span className="font-medium">{loanResult.equalPrincipal.lastPayment.toLocaleString()}원</span>
                        </div>
                        <div className="flex justify-between">
                          <span>총 이자:</span>
                          <span className="font-medium text-red-600">{loanResult.equalPrincipal.totalInterest.toLocaleString()}원</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* 만기일시상환 결과 */}
                  {loanResult.maturity && (
                    <div className="bg-gray-50 p-4 rounded">
                      <h4 className="text-md font-medium text-black mb-3">만기일시상환</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>월 이자:</span>
                          <span className="font-medium">{loanResult.maturity.monthlyInterest.toLocaleString()}원</span>
                        </div>
                        <div className="flex justify-between">
                          <span>만기 상환액:</span>
                          <span className="font-medium">{loanResult.maturity.finalPayment.toLocaleString()}원</span>
                        </div>
                        <div className="flex justify-between">
                          <span>총 상환액:</span>
                          <span className="font-medium">{loanResult.maturity.totalPayment.toLocaleString()}원</span>
                        </div>
                        <div className="flex justify-between">
                          <span>총 이자:</span>
                          <span className="font-medium text-red-600">{loanResult.maturity.totalInterest.toLocaleString()}원</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* 거치기간 후 상환 결과 */}
                  {loanResult.grace && (
                    <div className="bg-gray-50 p-4 rounded">
                      <h4 className="text-md font-medium text-black mb-3">거치기간 후 상환</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>거치기간 월 이자:</span>
                          <span className="font-medium">{loanResult.grace.graceInterest.toLocaleString()}원</span>
                        </div>
                        <div className="flex justify-between">
                          <span>거치기간 총 이자:</span>
                          <span className="font-medium text-orange-600">{loanResult.grace.graceTotal.toLocaleString()}원</span>
                        </div>
                        <div className="flex justify-between">
                          <span>상환기간 월 납입:</span>
                          <span className="font-medium">{loanResult.grace.monthlyPayment.toLocaleString()}원</span>
                        </div>
                        <div className="flex justify-between">
                          <span>총 상환액:</span>
                          <span className="font-medium">{loanResult.grace.totalPayment.toLocaleString()}원</span>
                        </div>
                        <div className="flex justify-between">
                          <span>총 이자:</span>
                          <span className="font-medium text-red-600">{loanResult.grace.totalInterest.toLocaleString()}원</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 개인회생 변제금 계산기 */}
        {activeTab === 'recovery' && (
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-medium text-black mb-4">개인회생 변제금 계산기</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    총 부채액 (원)
                  </label>
                  <input
                    type="text"
                    value={totalDebt}
                    onChange={(e) => handleAmountChange(e.target.value, setTotalDebt)}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
                    placeholder="50,000,000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    월 소득 (원)
                  </label>
                  <input
                    type="text"
                    value={monthlyIncome}
                    onChange={(e) => handleAmountChange(e.target.value, setMonthlyIncome)}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
                    placeholder="3,000,000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    연령
                  </label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
                    placeholder="35"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    가족 수 (본인 포함)
                  </label>
                  <select
                    value={familySize}
                    onChange={(e) => setFamilySize(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    <option value="">선택하세요</option>
                    <option value="1">1명</option>
                    <option value="2">2명</option>
                    <option value="3">3명</option>
                    <option value="4">4명</option>
                    <option value="5">5명 이상</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    부양가족 수 (노부모, 자녀 등)
                  </label>
                  <input
                    type="number"
                    value={dependents}
                    onChange={(e) => setDependents(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
                    placeholder="2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    부채 원인
                  </label>
                  <select
                    value={debtCause}
                    onChange={(e) => setDebtCause(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    <option value="">선택하세요</option>
                    <option value="living">생계형 부채</option>
                    <option value="business">사업실패</option>
                    <option value="medical">의료비</option>
                    <option value="gambling">도박/주식투자</option>
                    <option value="luxury">사치성 소비</option>
                    <option value="other">기타</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    직업 형태
                  </label>
                  <select
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    <option value="">선택하세요</option>
                    <option value="regular">정규직</option>
                    <option value="irregular">비정규직</option>
                    <option value="self-employed">자영업</option>
                    <option value="unemployed">무직</option>
                  </select>
                </div>
                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                    <input
                      type="checkbox"
                      checked={isBasicLivelihood}
                      onChange={(e) => setIsBasicLivelihood(e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <span>기초생활수급자</span>
                  </label>
                </div>
                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                    <input
                      type="checkbox"
                      checked={hasChronicDisease}
                      onChange={(e) => setHasChronicDisease(e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <span>중증질환자</span>
                  </label>
                </div>
                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                    <input
                      type="checkbox"
                      checked={hasAssets}
                      onChange={(e) => setHasAssets(e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <span>부동산 등 자산 보유</span>
                  </label>
                </div>
                {hasAssets && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      자산 가액 (원)
                    </label>
                    <input
                      type="text"
                      value={assetValue}
                      onChange={(e) => handleAmountChange(e.target.value, setAssetValue)}
                      className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
                      placeholder="100,000,000"
                    />
                  </div>
                )}
                <button
                  onClick={calculateRecovery}
                  className="w-full bg-gray-900 text-white py-3 rounded hover:bg-gray-800"
                >
                  계산하기
                </button>
                <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
                  <p className="font-medium text-gray-700 mb-2">⚠️ 주의사항</p>
                  <ul className="space-y-1 text-xs">
                    <li>• 본 계산기는 참고용이며, 실제 변제계획은 법원 및 전문가와 상담이 필요합니다.</li>
                    <li>• 부채 원인(도박, 사치성 소비 등)에 따라 변제율이 조정될 수 있습니다.</li>
                    <li>• 기초생활수급자는 변제 면제 대상이 될 수 있습니다.</li>
                    <li>• 고령자(65세 이상)나 중증질환자는 변제기간 단축 및 변제율 조정 가능합니다.</li>
                    <li>• 실제 법원 결정은 개별 상황에 따라 달라질 수 있습니다.</li>
                  </ul>
                </div>
              </div>
              
              {recoveryResult && (
                <div className="space-y-4">
                  {recoveryResult.specialStatus && (
                    <div className="bg-blue-50 p-4 rounded border border-blue-200">
                      <h4 className="text-md font-medium text-blue-800 mb-2">특별 상황</h4>
                      <p className="text-sm text-blue-700">{recoveryResult.specialStatus}</p>
                    </div>
                  )}
                  
                  {recoveryResult.statusNote && (
                    <div className="bg-yellow-50 p-4 rounded border border-yellow-200">
                      <h4 className="text-md font-medium text-yellow-800 mb-2">변제율 조정 사유</h4>
                      <p className="text-sm text-yellow-700">{recoveryResult.statusNote}</p>
                      {recoveryResult.baseRate && (
                        <p className="text-xs text-yellow-600 mt-1">
                          기본 변제율: {recoveryResult.baseRate}% → 조정 변제율: {recoveryResult.repaymentRate}%
                        </p>
                      )}
                    </div>
                  )}
                  
                  <div className="bg-gray-50 p-4 rounded">
                    <h4 className="text-md font-medium text-black mb-3">생계비 분석</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>최저생계비:</span>
                        <span className="font-medium">{recoveryResult.livingCost.toLocaleString()}원</span>
                      </div>
                      <div className="flex justify-between">
                        <span>가처분소득:</span>
                        <span className="font-medium">{recoveryResult.disposableIncome.toLocaleString()}원</span>
                      </div>
                      {recoveryResult.liquidationValue > 0 && (
                        <div className="flex justify-between">
                          <span>청산가치:</span>
                          <span className="font-medium">{recoveryResult.liquidationValue.toLocaleString()}원</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded">
                    <h4 className="text-md font-medium text-black mb-3">예상 변제계획</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>변제기간:</span>
                        <span className="font-medium">{recoveryResult.repaymentPeriod ? `${recoveryResult.repaymentPeriod}개월` : '60개월'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>월 변제금:</span>
                        <span className="font-medium">{recoveryResult.monthlyRepayment.toLocaleString()}원</span>
                      </div>
                      <div className="flex justify-between">
                        <span>총 변제액:</span>
                        <span className="font-medium">{recoveryResult.totalRepayment.toLocaleString()}원</span>
                      </div>
                      <div className="flex justify-between">
                        <span>변제율:</span>
                        <span className="font-medium text-blue-600">{recoveryResult.repaymentRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>면책 예상액:</span>
                        <span className="font-medium text-green-600">{recoveryResult.remainingDebt.toLocaleString()}원</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 리스트 광고 */}
        <div className="mt-6">
          <div className="flex items-start py-2 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded -mx-2 px-2">
            <div className="flex-shrink-0 w-8 text-right">
              <span className="text-sm text-orange-400">#AD</span>
            </div>
            <div className="flex-1 ml-4">
              <div className="flex items-center space-x-2">
                <a href="#" className="text-black hover:text-orange-600 text-sm leading-relaxed">
                  저금리 대출 비교 플랫폼 - AI 맞춤 대출 상품 추천
                </a>
                <span className="text-xs text-orange-600 bg-orange-100 px-2 py-0.5 rounded">
                  금융 광고
                </span>
              </div>
              <div className="flex items-center space-x-3 mt-1 text-xs text-gray-500">
                <span>핀테크 플랫폼</span>
                <span>AI 분석</span>
                <span>최저금리</span>
                <span>즉시 심사</span>
              </div>
            </div>
          </div>
        </div>

        {/* 구글 애드센스 영역 */}
        <div className="mt-6">
          <div className="flex items-start py-2 bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-300 rounded -mx-2 px-2">
            <div className="flex-shrink-0 w-8 text-right">
              <span className="text-sm text-gray-400">#AD</span>
            </div>
            <div className="flex-1 ml-4">
              <div className="flex items-center space-x-2">
                <a href="#" className="text-black hover:text-gray-600 text-sm leading-relaxed">
                  맞춤형 금융 상품 추천 - Google AI 기반 개인화 서비스
                </a>
                <span className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                  구글 광고
                </span>
              </div>
              <div className="flex items-center space-x-3 mt-1 text-xs text-gray-500">
                <span>Google AdSense</span>
                <span>자동 최적화</span>
                <span>개인 맞춤</span>
                <span>안전한 서비스</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 푸터 */}
      <footer className="border-t border-gray-200 mt-16 py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="mb-4">
                <h3 className="text-lg font-normal text-black">
                  <Link href="/" className="hover:text-blue-600">크레딧스토리</Link>
                </h3>
                <p className="text-xs text-gray-500 -mt-1">Credit Story</p>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                신용회복과 금융 재건을 위한 정보 공유 커뮤니티입니다.<br/>
                개인회생, 법인회생, 워크아웃 등 다양한 경험을 나누며<br/>
                함께 성장해나가는 공간입니다.
              </p>
              <p className="text-xs text-gray-500">
                본 사이트의 정보는 참고용이며, 전문가와 상담을 권장합니다.
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-black mb-4">커뮤니티</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="/credit" className="hover:text-blue-600">신용이야기</a></li>
                <li><a href="/personal" className="hover:text-blue-600">개인회생</a></li>
                <li><a href="/corporate" className="hover:text-blue-600">법인회생</a></li>
                <li><a href="/workout" className="hover:text-blue-600">워크아웃</a></li>
                <li><a href="/card" className="hover:text-blue-600">신용카드</a></li>
                <li><a href="/loan" className="hover:text-blue-600">대출</a></li>
                <li><a href="/news" className="hover:text-blue-600">뉴스정보</a></li>
                <li><a href="/calculator" className="hover:text-blue-600">계산기</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-black mb-4">정보</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="/ad" className="hover:text-blue-600">광고문의</a></li>
                <li><a href="/admin" className="hover:text-red-600 text-gray-500">관리자</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-8 pt-8 text-center">
            <p className="text-xs text-gray-500">
              © 2024 크레딧스토리. 모든 권리 보유.
            </p>
          </div>
        </div>
      </footer>

      {/* 스티키 광고 */}
      {showStickyAd && (
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg z-50">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  금융 계산기 전문 서비스 - 정확한 금융 계획
                </p>
                <p className="text-xs text-blue-100 truncate">
                  무료 계산 | 맞춤 분석 | 전문가 상담
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="bg-white text-blue-600 px-4 py-1.5 rounded text-sm font-medium hover:bg-blue-50 transition-colors">
                상담신청
              </button>
              <button
                onClick={() => setShowStickyAd(false)}
                className="text-blue-100 hover:text-white p-1 rounded transition-colors"
                aria-label="광고 닫기"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 