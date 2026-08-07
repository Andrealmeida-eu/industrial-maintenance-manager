package com.ajsolutions.barber.business.services;

import com.ajsolutions.barber.business.dtos.in.TurnoRequestDTO;
import com.ajsolutions.barber.business.dtos.out.ApontamentoResponseDTO;
import com.ajsolutions.barber.business.dtos.out.TurnoResponseDTO;
import com.ajsolutions.barber.infra.enums.TipoTurno;
import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
public class TarefaService {

    // Estilos de fontes extraídos como constantes para não recriar toda hora
    private static final Font FONT_TITULO = new Font(Font.HELVETICA, 18, Font.BOLD);
    private static final Font FONT_SUBTITULO = new Font(Font.HELVETICA, 12, Font.BOLD);
    private static final Font FONT_NORMAL = new Font(Font.HELVETICA, 10, Font.NORMAL);
    private static final Font FONT_CABECALHO_TABELA = new Font(Font.HELVETICA, 10, Font.BOLD);

    /**
     * Gera o relatório PDF de turmas em memória e retorna como um array de bytes.
     */
    public byte[] gerarRelatorioTurmasPdf(List<TurnoResponseDTO> turmas) {
        log.info("Iniciando geração do relatório de turmas. Total de turmas: {}", turmas.size());

        // 1. Ordenar a lista de turmas cronologicamente com base no turno
        List<TurnoResponseDTO> turmasOrdenadas = turmas.stream()
                .sorted(Comparator.comparingInt(t -> obterOrdemTurno(t.getHorarioTurno())))
                .toList();

        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            Document document = new Document();
            PdfWriter.getInstance(document, outputStream);

            document.open();
            adicionarTitulo(document);

            // 2. Iterar sobre a lista já ordenada
            for (TurnoResponseDTO turma : turmasOrdenadas) {
                adicionarInformacoesTurma(document, turma);
                adicionarTabelaApontamentos(document, turma.getApontamentos());

            }

            document.close();
            log.info("Relatório gerado com sucesso.");

            return outputStream.toByteArray();

        } catch (Exception e) {
            log.error("Erro inesperado ao gerar o relatório PDF das turmas", e);
            throw new RuntimeException("Erro ao processar o arquivo PDF.", e);
        }
    }

    private void adicionarTitulo(Document document) throws DocumentException {
        Paragraph titulo = new Paragraph("Relatório de Apontamentos", FONT_TITULO);
        titulo.setAlignment(Element.ALIGN_CENTER);
        titulo.setSpacingAfter(20);
        document.add(titulo);
    }

    private void adicionarInformacoesTurma(Document document, TurnoResponseDTO turma) throws DocumentException {
        Paragraph infoTurma = new Paragraph(
                String.format("%s", turma.getNomeTurma()),
                FONT_SUBTITULO
        );
        infoTurma.setSpacingBefore(15);
        document.add(infoTurma);

        String horarioFormatado = formatarHorarioTurno(turma.getHorarioTurno());
        document.add(new Paragraph(
                String.format("Data do Turno: %s | Horário: %s", turma.getDataTurno(), horarioFormatado),
                FONT_NORMAL
        ));

        String integrantes = turma.getIntegrantes() != null ? String.join(", ", turma.getIntegrantes()) : "Nenhum";
        document.add(new Paragraph("Integrantes: " + integrantes, FONT_NORMAL));
        document.add(new Paragraph(" ", FONT_NORMAL)); // Espaçamento
    }

    private void adicionarTabelaApontamentos(Document document, List<ApontamentoResponseDTO> apontamentos) throws DocumentException {
        if (apontamentos == null || apontamentos.isEmpty()) {
            document.add(new Paragraph("Nenhum apontamento registrado para este turno.", FONT_NORMAL));
            return;
        }

        PdfPTable table = new PdfPTable(4);
        table.setWidthPercentage(100);
        table.setSpacingBefore(10f);
        table.setSpacingAfter(10f);
        table.setWidths(new float[]{1.5f, 2.0f, 2.0f, 4.5f});

        // Adicionando cabeçalho da tabela
        table.addCell(new Paragraph("Horário", FONT_CABECALHO_TABELA));
        table.addCell(new Paragraph("Nº SM", FONT_CABECALHO_TABELA));
        table.addCell(new Paragraph("Nº OS", FONT_CABECALHO_TABELA));
        table.addCell(new Paragraph("Trabalho Realizado", FONT_CABECALHO_TABELA));

        // Preenchendo dados
        for (ApontamentoResponseDTO ap : apontamentos) {
            table.addCell(new Paragraph(ap.getHorarioRegistro(), FONT_NORMAL));
            table.addCell(new Paragraph(obterValorOuTraco(ap.getNumeroSM()), FONT_NORMAL));
            table.addCell(new Paragraph(obterValorOuTraco(ap.getNumeroOS()), FONT_NORMAL));
            table.addCell(new Paragraph(ap.getTrabalhoRealizado(), FONT_NORMAL));
        }

        document.add(table);
    }

    private String formatarHorarioTurno(TipoTurno turno) {
        if (turno == null) return "Horário não definido";

        // Uso de Switch Expression (recurso do Java 14+)
        return switch (turno) {
            case MANHA -> "06:00 às 15:20";
            case TARDE -> "15:00 às 23:14";
            case NOITE -> "22:50 às 06:20";
        };
    }

    private int obterOrdemTurno(TipoTurno turno) {
        if (turno == null) return 99; // Joga turnos não definidos para o final da lista

        return switch (turno) {
            case MANHA -> 1; // Prioridade 1 (06:00)
            case TARDE -> 2; // Prioridade 2 (15:00)
            case NOITE -> 3; // Prioridade 3 (22:50)
        };
    }

    private String obterValorOuTraco(String valor) {
        return (valor != null && !valor.isBlank()) ? valor : "-";
    }
}