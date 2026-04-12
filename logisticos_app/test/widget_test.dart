import 'package:flutter_test/flutter_test.dart';
import 'package:logisticos_app/main.dart';

void main() {
  testWidgets('App smoke test — login screen renders', (WidgetTester tester) async {
    await tester.pumpWidget(const LogisticosApp());
    await tester.pump();
    expect(find.text('Iniciar sesión'), findsOneWidget);
  });
}
