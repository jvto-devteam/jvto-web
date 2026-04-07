import WhatsappConsole from "./WhatsappConsole";
import { getGatewayStatus, getWhatsappDashboardData } from "@/lib/whatsapp/admin";

export const dynamic = "force-dynamic";

export default async function WhatsappCmsPage() {
  const [dashboard, gatewayStatus] = await Promise.all([
    getWhatsappDashboardData(),
    getGatewayStatus(),
  ]);

  if (!dashboard.schemaReady) {
    return (
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-50">WhatsApp Operations</h2>
          <p className="text-sm text-slate-400">
            The WhatsApp schema is not ready yet. Start the gateway service once so it can bootstrap the
            shared tables in PostgreSQL.
          </p>
        </div>
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-4 text-sm text-amber-100">
          Expected next step: boot `services/wa-gateway`, let it create the `wa_*` tables, then refresh this page.
        </div>
      </section>
    );
  }

  return (
    <WhatsappConsole
      initialGatewayStatus={gatewayStatus}
      initialQuickReplies={dashboard.quickReplies}
      handoffs={dashboard.handoffs}
      conversations={dashboard.conversations}
      messages={dashboard.messages}
    />
  );
}
