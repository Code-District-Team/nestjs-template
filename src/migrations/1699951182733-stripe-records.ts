import { MigrationInterface, QueryRunner } from "typeorm"

// {
//     "object": {
//     "id": "pi_3OCI4NF8kfyxaVXE23XFTxeM",
//       "object": "payment_intent",
//       "amount": 1000,
//       "amount_capturable": 0,
//       "amount_details": {
//        .  "tip": {
//         }
//     },
//     "amount_received": 1000,
//       "application": null,
//       "application_fee_amount": null,
//       "automatic_payment_methods": null,
//       "canceled_at": null,
//       "cancellation_reason": null,
//       "capture_method": "automatic",
//       "client_secret": "pi_3OCI4NF8kfyxaVXE23XFTxeM_secret_GEvtEBXQXpfsgOGIWS86wDF3S",
//       "confirmation_method": "automatic",
//       "created": 1699950843,
//       "currency": "usd",
//       "customer": null,
//       "description": null,
//       "invoice": null,
//       "last_payment_error": null,
//       "latest_charge": "ch_3OCI4NF8kfyxaVXE2kOgyVd0",
//       "livemode": false,
//       "metadata": {
//     },
//     "next_action": null,
//       "on_behalf_of": null,
//       "payment_method": "pm_1OCI4MF8kfyxaVXEZbv905Uu",
//       "payment_method_configuration_details": null,
//       "payment_method_options": {
//         "card": {
//             "installments": null,
//               "mandate_options": null,
//               "network": null,
//               "request_three_d_secure": "automatic"
//         }
//     },
//     "payment_method_types": [
//         "card"
//     ],
//       "processing": null,
//       "receipt_email": null,
//       "review": null,
//       "setup_future_usage": null,
//       "shipping": null,
//       "source": null,
//       "statement_descriptor": null,
//       "statement_descriptor_suffix": null,
//       "status": "succeeded",
//       "transfer_data": null,
//       "transfer_group": null
// }
// }

export class StripeRecords1699951182733 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
