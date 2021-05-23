import jakarta.servlet.*;
import jakarta.servlet.http.*;
import jakarta.servlet.annotation.*;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;

@WebServlet(name = "CardRemoveServlet", value = "/CardRemoveServlet")
public class CardRemoveServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(request.getInputStream()));
        String cardId = "";
        cardId = br.readLine();
        try {
            String myDriver = "com.mysql.cj.jdbc.Driver";
            Class.forName(myDriver);
            Connection conn = DriverManager.getConnection
                    ("jdbc:mysql://localhost:3306/db1","user",
                            "20552055");
            Statement st0 = conn.createStatement();
            String act = "DELETE FROM db1.card_db WHERE id = " + cardId;
            st0.execute(act);
            st0.close();
            conn.close();
        }catch (SQLException | ClassNotFoundException throwables) {
            throwables.printStackTrace();
        }
        br.close();

    }
}
