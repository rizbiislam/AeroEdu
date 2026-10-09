import type { InstitutePaymentAccount } from '../types';

/** Domain rules for institute-owned collection account configuration. */
export class InstituteConfigurationService {
  validatePaymentAccounts(accounts: readonly InstitutePaymentAccount[]): string | null {
    const missingRequiredFields = accounts.some((account) =>
      !account.bank_name.trim() || !account.account_name.trim() || !account.account_number.trim()
    );
    if (missingRequiredFields) return 'Add a provider, account name, and account number for every payment method.';

    const duplicateAccount = accounts.some((account, index) => accounts.some((other, otherIndex) =>
      otherIndex < index && other.payment_method === account.payment_method && other.account_number.trim() === account.account_number.trim()
    ));
    if (duplicateAccount) return 'The same payment account is listed more than once.';

    return null;
  }
}
