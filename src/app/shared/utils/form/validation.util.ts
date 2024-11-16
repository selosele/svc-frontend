/** 유효성 검증 메시지 */
export const validationMessage = {
  required: () => '필수 입력 항목이에요.',
  min: (len: number) => `최소 ${len} 이상이어야 해요.`,
  max: (len: number) => `최대 ${len} 이하여야 해요.`,
  minLength: (len: number) => `최소 ${len}글자 이상이어야 해요.`,
  maxlength: (len: number) => `최대 ${len}글자 이하여야 해요.`,
  numeric: () => `숫자만 입력 가능해요.`,
  between: (start: number, end: number) => `${start}에서 ${end} 사이여야 해요.`,
  betweenLength: (start: number, end: number) => `${start}글자에서 ${end}글자 사이여야 해요.`,
  email: () => '유효한 형식의 이메일주소를 입력하세요.',
};
