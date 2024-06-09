/** 유효성 검증 메시지 */
export const validationMessage = {
  required: () => '필수 입력 항목입니다.',
  min: (len: number) => `최소 ${len}글자 이상이어야 합니다.`,
  max: (len: number) => `최대 ${len}글자 이하여야 합니다.`,
  minLength: (len: number) => `최소 ${len}글자 이상이어야 합니다.`,
  maxlength: (len: number) => `최대 ${len}글자 이하여야 합니다.`,
  numeric: () => `숫자만 입력 가능합니다.`,
};
